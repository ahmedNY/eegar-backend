import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateRentDto } from '../dto/create-rent.dto';
import { UpdateRentDto } from '../dto/update-rent.dto';
import { Rent } from '../entities/rent.entity';

@Injectable()
export class RentsService {
  constructor(
    @InjectRepository(Rent) private repo: Repository<Rent>
  ) { }

  create(dto: CreateRentDto, userId: number): Promise<Rent> {
    return this.repo.save(this.repo.create({...dto, createdById: userId}));
  }

  findAll(): Promise<Rent[]> {
    return this.repo.find({
      relations: {
        customer: {companions: true},
        payments: true,
        extensions: true,
        asset: true,
        createdBy: true,
        updatedBy: true,
      }
    });
  }

  findOne(id: number): Promise<Rent> {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateRentDto, userId: number): Promise<Rent> {
    const row = await this.repo.findOneOrFail({ where: { id } });
    return this.repo.save(this.repo.create({ ...row, ...dto, updatedById: userId }));
  }

  remove(id: number): Promise<DeleteResult> {
    return this.repo.delete({ id });
  }
}
