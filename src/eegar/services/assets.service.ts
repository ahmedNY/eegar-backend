import { PaginatedDataQueryDto, SortingDirection } from '@/shared/dto/paginated-data.dto';
import { PaginatedResultDto } from '@/shared/dto/paginated-result.dto';
import { PaginatedDataService } from '@/shared/services/paginated-data.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, EntityManager, In, QueryBuilder, Repository } from 'typeorm';
import { CreateAssetDto } from '../dto/create-asset.dto';
import { UpdateAssetDto } from '../dto/update-asset.dto';
import { Asset } from '../entities/asset.entity';
import * as path from 'path';
import { nanoid } from 'nanoid/async';
import { writeFile, rm } from "fs/promises";
import { RentsService } from './rents.service';
import { Rent } from '../entities/rent.entity';
import { Cron } from '@nestjs/schedule';
import { HomeAssetDto } from '../dto/home_asset.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_IS_LEAVING_TODAY, EVENT_IS_LEAVING_TOMORROW, EVENT_IS_OVERDUE } from '@/events';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset) private repo: Repository<Asset>,
    @InjectEntityManager() private entityManger: EntityManager,
    private paginatedDataService: PaginatedDataService,
    private rentsService: RentsService,
    private eventEmitter: EventEmitter2,
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

  async findAllForHomePage(): Promise<HomeAssetDto[]> {
    const assets = await this.repo
      .createQueryBuilder('a')
      .select('distinct a.*')
      .addSelect("(SELECT r1.id FROM rent r1 WHERE a.id = r1.assetId ORDER BY r1.updatedAt DESC LIMIT 1)", 'lastRentId')
      .orderBy('a.district', 'DESC')
      .addOrderBy('a.floor')
      .addOrderBy('a.assetName')
      .getRawMany();


    const rents = await this.rentsService.findByIds(assets.map(e => e.lastRentId));

    for (const asset of assets) {
      asset.lastRent = rents.find(r => r.assetId == asset.id);
    }
    return assets;
  }

  async findVacant(): Promise<Asset[]> {
    /**
     * SELECT * FROM  (SELECT *, (
      SELECT rent.rentState
      FROM rent
      WHERE rent.assetId = asset.id
      ORDER BY rent.createdAt
      LIMIT 1) lastRentState
      FROM asset) AS res
      WHERE res.lastRentState <> "checkedIn" OR res.lastRentState IS null
     */
    return this.entityManger
      .createQueryBuilder()
      .select("*")
      .from((qb) => {
        return qb
          .select('asset.*')
          .addSelect((qb) => {
            return qb
              .select('rent.rentState')
              .from(Rent, 'rent')
              .where('rent.assetId = asset.id')
              .orderBy('rent.createdAt', 'DESC')
              .limit(1);
          }, 'lastRentState')
          .from(Asset, 'asset')
          .orderBy('asset.district', 'DESC')
          .addOrderBy('asset.floor')
          .addOrderBy('asset.assetName')
          ;
      }, 'res')
      .where('res.lastRentState IN("checkedOut", "canceled") OR res.lastRentState IS null')
      .getRawMany() as any;
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

  @Cron('00 12 * * * *')
  async handleCron() {
    const assets = await this.findAllForHomePage();
    for (const asset of assets) {
      if (asset.lastRent == null) {
        continue;
      }

      if (asset.lastRent.isLeavingTomorrow) {
        this.eventEmitter.emit(EVENT_IS_LEAVING_TOMORROW, asset);
        return;
      }
      
      if (asset.lastRent.isLeavingToday) {
        this.eventEmitter.emit(EVENT_IS_LEAVING_TODAY, asset);
        return;
      }
      
      if (asset.lastRent.isOverdue) {
        this.eventEmitter.emit(EVENT_IS_OVERDUE, asset);
        return;
      }

    }
  }
}
