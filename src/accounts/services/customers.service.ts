import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { rm, writeFile } from 'fs/promises';
import { nanoid } from 'nanoid';
import path from 'path';
import { DeleteResult, Repository } from 'typeorm';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer) private repo: Repository<Customer>
  ) { }

  create(createCustomerDto: CreateCustomerDto, userId: number): Promise<Customer> {
    return this.repo.save(this.repo.create({ ...createCustomerDto, createdById: userId }));
  }

  findAll(): Promise<Customer[]> {
    return this.repo.find();
  }

  findOne(id: number): Promise<Customer> {
    return this.repo.findOne({
      where: { id }, relations: {
        withCustomer: true,
        companions: true,
      }
    });
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const row = await this.repo.findOneOrFail({ where: { id } });
    return this.repo.save(this.repo.create({ ...row, ...updateCustomerDto }));
  }

  remove(id: number): Promise<DeleteResult> {
    return this.repo.delete({ id });
  }


  async upload(assetId: number, fileType: string, file: Express.Multer.File) {
    const allowedFileTypes = ['identityDocument'];
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
