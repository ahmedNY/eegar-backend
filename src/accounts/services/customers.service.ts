import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer) private repo: Repository<Customer>
  ) { }

  create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.repo.save(this.repo.create(createCustomerDto));
  }

  findAll(): Promise<Customer[]> {
    return this.repo.find();
  }

  findOne(id: number): Promise<Customer> {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const row = await this.repo.findOneOrFail({ where: { id } });
    return this.repo.save(this.repo.create({ ...row, ...updateCustomerDto }));
  }

  remove(id: number): Promise<DeleteResult> {
    return this.repo.delete({ id });
  }
}