import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, EntityManager, In, Repository } from 'typeorm';
import { CreateRentDto } from '../dto/create-rent.dto';
import { UpdateRentDto } from '../dto/update-rent.dto';
import { Rent, RentState } from '../entities/rent.entity';

@Injectable()
export class RentsService {
  constructor(
    @InjectRepository(Rent) private repo: Repository<Rent>,
    @InjectEntityManager() private entityManager: EntityManager,
  ) { }

  create(dto: CreateRentDto, userId: number): Promise<Rent> {
    return this.repo.save(this.repo.create({ ...dto, createdById: userId }));
  }

  findAll(): Promise<Rent[]> {
    return this.repo.find({
      relations: {
        customer: { companions: true },
        payments: true,
        extensions: { payment: true },
        asset: true,
        createdBy: true,
        updatedBy: true,
      }
    });
  }

  findByIds(ids: number[]): Promise<Rent[]> {
    return this.repo.findBy({
      id: In(ids)
    })
  }

  findOne(id: number): Promise<Rent> {
    return this.repo.findOne({
      where: { id },
      relations: {
        customer: { companions: true },
        payments: true,
        extensions: { payment: true },
        asset: true,
        createdBy: true,
        updatedBy: true,
      },
    });
  }

  findMonthlyOccupationReport(assetId: number, year: number) {
    const qb = this.entityManager
      .createQueryBuilder()
      .select("td.month", "month")
      .addSelect("COUNT(r.id)", "occupiedDays")
      .from('time_dimension', 'td')
      .leftJoin('rent', 'r', 'r.assetId = :assetId AND td.db_date BETWEEN r.dateFrom AND DATE_ADD(r.dateFrom, INTERVAL (r.numberOfNights + (SELECT IF(SUM(e.numberOfNights) IS NULL,0 , SUM(e.numberOfNights)) FROM extension e WHERE e.rentId = r.id)) DAY)', { assetId })
      .where('td.`year` = :year', { year })
      .groupBy('td.month');
      
    if (new Date().getFullYear() == year) {
      qb.where('td.`year` = :year AND td.month <= MONTH(NOW())', { year })
    }
    return qb
      .getRawMany()
  }

  async cancel(id: number, userId: number): Promise<Rent> {
    const row = await this.repo.findOneOrFail({ where: { id } });
    return this.repo.save(this.repo.create({ ...row, rentState: RentState.canceled, updatedById: userId }));
  }

  async update(id: number, dto: UpdateRentDto, userId: number): Promise<Rent> {
    const row = await this.repo.findOneOrFail({ where: { id } });
    return this.repo.save(this.repo.create({ ...row, ...dto, updatedById: userId }));
  }

  remove(id: number): Promise<DeleteResult> {
    return this.repo.delete({ id });
  }
}
