import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateBrokerDto } from '../dto/create-broker.dto';
import { UpdateBrokerDto } from '../dto/update-broker.dto';
import { Broker } from '../entities/broker.entity';

@Injectable()
export class BrokersService {
  constructor(
    @InjectRepository(Broker) private repo: Repository<Broker>
  ) { }

  create(dto: CreateBrokerDto): Promise<Broker> {
    return this.repo.save(this.repo.create(dto));
  }

  findAll(): Promise<Broker[]> {
    return this.repo.find();
  }

  findOne(id: number): Promise<Broker> {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateBrokerDto): Promise<Broker> {
    const row = await this.repo.findOneOrFail({ where: { id } });
    return this.repo.save(this.repo.create({ ...row, ...dto }));
  }

  remove(id: number): Promise<DeleteResult> {
    return this.repo.delete({ id });
  }
}
