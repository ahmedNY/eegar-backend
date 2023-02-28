import { PaginatedDataQueryDto } from '@/shared/dto/paginated-data.dto';
import { PaginatedResultDto } from '@/shared/dto/paginated-result.dto';
import { PaginatedDataService } from '@/shared/services/paginated-data.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { rm, writeFile } from 'fs/promises';
import { nanoid } from 'nanoid';
import * as path from 'path';
import { DeleteResult, Repository } from 'typeorm';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { Asset } from '../entities/asset.entity';
import { Payment } from '../entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private repo: Repository<Payment>,
    private paginatedDataService: PaginatedDataService,
  ) { }

  create(dto: CreatePaymentDto, userId: number): Promise<Payment> {
    return this.repo.save(this.repo.create({ ...dto, createdById: userId }));
  }

  findAll(): Promise<Payment[]> {
    return this.repo.find();
  }

  findAllPaginated(dto: PaginatedDataQueryDto): Promise<PaginatedResultDto<Payment>> {
    return this.paginatedDataService.findAll(Payment, dto, {
      relations: {
        createdBy: true,
        updatedBy: true,
      }
    });
  }

  findOne(id: number): Promise<Payment> {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdatePaymentDto, userId: number): Promise<Payment> {
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
}
