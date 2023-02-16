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

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset) private repo: Repository<Asset>,
    private paginatedDataService: PaginatedDataService,
  ) { }

  create(userId: number, dto: CreateAssetDto): Promise<Asset> {
    return this.repo.save(this.repo.create({ ...dto, createdById: userId }));
  }

  findAll(): Promise<Asset[]> {
    return this.repo.find({ relations: { category: true } });
  }

  findAllPaginated(dto: PaginatedDataQueryDto): Promise<PaginatedResultDto<Asset>> {
    return this.paginatedDataService.findAll(Asset, dto, {
      relations: {
        category: true,
        createdBy: true,
        updatedBy: true,
      }
    });
  }

  async findAllPaginatedForApp(dto: PaginatedDataQueryDto, userId: number) {
    const qb = this.paginatedDataService.queryBuilder(Asset,'v', dto);
    const docs = await qb
      .leftJoinAndSelect('v.category', 'c')
      .leftJoinAndSelect('v.usersLiked', 'liked', 'userId = :userId', { userId })
      .addSelect('100 as v_viewCount')
      .getMany();
    return { docs };
  }

  findOne(id: number): Promise<Asset> {
    return this.repo.findOne({ where: { id }, relations: { category: true } });
  }

  async update(id: number, dto: UpdateAssetDto, userId: number): Promise<Asset> {
    const row = await this.repo.findOneOrFail({ where: { id } });
    return this.repo.save(this.repo.create({ ...row, ...dto, updatedById: userId }));
  }

  remove(id: number): Promise<DeleteResult> {
    return this.repo.delete({ id });
  }

  async upload(assetId: number, fileType: string, file: Express.Multer.File) {
    const allowedFileTypes = ['thumbnail', 'posterPortrait', 'posterLandscape'];
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

  async userLikedAsset(userId: number, assetId: number): Promise<boolean> {
    const asset = await this.repo.findOne({
      where: { id: assetId },
      relations: { usersLiked: true },
    });
    if (asset == null) {
      throw new NotFoundException('Asset not found');
    }
    asset.usersLiked = [...asset.usersLiked || [], { id: userId } as any];
    await this.repo.save(asset);
    return true;
  }
}
