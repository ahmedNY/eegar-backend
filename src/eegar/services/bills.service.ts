import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { rm, writeFile } from 'fs/promises';
import { nanoid } from 'nanoid';
import path from 'path';
import { DeleteResult, Repository } from 'typeorm';
import { CreateBillDto } from '../dto/create-bill.dto';
import { UpdateBillDto } from '../dto/update-bill.dto';
import { Bill } from '../entities/bill.entity';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill) private repo: Repository<Bill>
  ) { }

  create(createBillDto: CreateBillDto): Promise<Bill> {
    return this.repo.save(this.repo.create(createBillDto));
  }

  findAll(): Promise<Bill[]> {
    return this.repo.find();
  }

  findOne(id: number): Promise<Bill> {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: number, updateBillDto: UpdateBillDto): Promise<Bill> {
    const row = await this.repo.findOneOrFail({ where: { id } });
    return this.repo.save(this.repo.create({ ...row, ...updateBillDto }));
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
