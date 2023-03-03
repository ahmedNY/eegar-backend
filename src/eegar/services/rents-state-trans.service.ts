import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateRentStateTransDto } from '../dto/create-rent-state.dto';
import { RentStateTrans } from '../entities/rent-state.entity';

@Injectable()
export class RentStateTransService {
  constructor(
    @InjectRepository(RentStateTrans) private repo: Repository<RentStateTrans>
  ) { }

  create(dto: CreateRentStateTransDto): Promise<RentStateTrans> {
    return this.repo.save(this.repo.create(dto));
  }

  findAll(): Promise<RentStateTrans[]> {
    return this.repo.find();
  }

  findOne(id: number): Promise<RentStateTrans> {
    return this.repo.findOne({ where: { id } });
  }

//   async update(id: number, updateRentStateTransDto: UpdateRentStateTransDto): Promise<RentStateTrans> {
//     const row = await this.repo.findOneOrFail({ where: { id } });
//     return this.repo.save(this.repo.create({ ...row, ...updateRentStateTransDto }));
//   }

  remove(id: number): Promise<DeleteResult> {
    return this.repo.delete({ id });
  }
}
