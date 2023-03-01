import { PaginatedDataQueryDto, SortingDirection } from '@/shared/dto/paginated-data.dto';
import { PaginatedResultDto } from '@/shared/dto/paginated-result.dto';
import { PaginatedDataService } from '@/shared/services/paginated-data.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, QueryBuilder, Repository } from 'typeorm';
import { CreateAssetDto } from '../dto/create-asset.dto';
import { UpdateAssetDto } from '../dto/update-asset.dto';
import { Asset } from '../entities/asset.entity';
import * as path from 'path';
import { nanoid } from 'nanoid/async';
import { writeFile, rm } from "fs/promises";
import { RentsService } from './rents.service';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset) private repo: Repository<Asset>,
    private paginatedDataService: PaginatedDataService,
    private rentsService: RentsService,
  ) { }

  create(userId: number, dto: CreateAssetDto): Promise<Asset> {
    return this.repo.save(this.repo.create({ ...dto, createdById: userId }));
  }

  findAll(): Promise<Asset[]> {
    return this.repo.find();
  }

  findAllPaginated(dto: PaginatedDataQueryDto): Promise<PaginatedResultDto<Asset>> {
    return this.paginatedDataService.findAll(Asset, dto, {
      relations: {
        createdBy: true,
        updatedBy: true,
      }
    });
  }

  async findAllForHomePage(): Promise<Asset[]> {
    const assets = await this.repo
      .createQueryBuilder('a')
      .select('distinct a.*')
      .addSelect("(SELECT r1.id FROM rent r1 WHERE a.id = r1.assetId ORDER BY r1.updatedAt DESC LIMIT 1)", 'lastRentId')
      .leftJoin('a.rents', 'r2')
      .orderBy('r2.updatedAt', 'DESC')
      .getRawMany();


    const rents = await this.rentsService.findByIds(assets.map(e => e.lastRentId));

    for (const asset of assets) {
      asset.lastRent = rents.find(r => r.assetId == asset.id);
    }
    return assets;
  }

  findOne(id: number): Promise<Asset> {
    return this.repo.findOne({
      where: { id },
      relations: {
        rents: {
          customer: true,
        },
      },
    });
  }

  async update(id: number, dto: UpdateAssetDto, userId: number): Promise<Asset> {
    const row = await this.repo.findOneOrFail({ where: { id } });
    return this.repo.save(this.repo.create({ ...row, ...dto, updatedById: userId }));
  }

  remove(id: number): Promise<DeleteResult> {
    return this.repo.delete({ id });
  }

  async upload(assetId: number, fileType: string, file: Express.Multer.File) {
    const allowedFileTypes = ['photo'];
    if (allowedFileTypes.includes(fileType) == false) {
      throw new BadRequestException(`invalid type "${fileType}" allowed fileType is [${allowedFileTypes.join(', ')}]`)
    }

    const asset = await this.repo.findOneBy({ id: assetId });
    if (asset == null) {
      throw new NotFoundException(`asset with id of "${assetId}" not found`)
    }

    if (asset[fileType]) {
      const existingFilePath = path.join(global.__basedir, '..', '..', 'uploads', asset[fileType]);
      await rm(existingFilePath);
    }

    const fileExt = file.originalname.split('.').pop();
    const fileName = `${await nanoid(5)}.${fileExt}`;
    const filePath = path.join(global.__basedir, '..', '..', 'uploads', fileName);
    await writeFile(filePath, file.buffer);
    asset[fileType] = fileName;
    await this.repo.save(asset);
    return asset;
  }

  async getUsedCategoryIds(): Promise<number[]> {
    const result = await this.repo.createQueryBuilder('v')
      .select('DISTINCT v.categoryId as categoryId')
      .getRawMany();
    return result.map(row => row.categoryId);
  }
}
