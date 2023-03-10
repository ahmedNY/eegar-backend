import { EVENT_RENT_CREATED, EVENT_RENT_STATE_CHANGED } from '@/events';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, EntityManager, In, Repository } from 'typeorm';
import { CreateRentDto } from '../dto/create-rent.dto';
import { UpdateRentDto } from '../dto/update-rent.dto';
import { canChangeState, RentState } from '../entities/rent-state';
import { Rent } from '../entities/rent.entity';
import { RentStateTransService } from './rents-state-trans.service';

@Injectable()
export class RentsService {
  constructor(
    @InjectRepository(Rent) private repo: Repository<Rent>,
    @InjectEntityManager() private entityManager: EntityManager,
    private eventEmitter: EventEmitter2,
    private rentStateTransService: RentStateTransService,
  ) { }

  async create(dto: CreateRentDto, userId: number): Promise<Rent> {
    const rent = await this.repo.save(this.repo.create({ ...dto, createdById: userId }));
    await this.rentStateTransService.create({
      createdById: userId,
      rentId: rent.id,
      state: rent.rentState,
    });
    this.eventEmitter.emit(EVENT_RENT_CREATED, rent);
    return rent;
  }

  findAll(): Promise<Rent[]> {
    return this.repo.find({
      relations: {
        customer: { companions: true },
        broker: true,
        payments: true,
        extensions: { payment: true },
        asset: true,
        createdBy: true,
        updatedBy: true,
      }
    });
  }

  findByIds(ids: number[]): Promise<Rent[]> {
    return this.repo.find({
      where: { id: In(ids) },
      relations:  {extensions: true}
    })
  }

  findOne(id: number): Promise<Rent> {
    return this.repo.findOne({
      where: { id },
      relations: {
        customer: { companions: true },
        broker: true,
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

  async changeState(newState: RentState, rentId: number, userId: number): Promise<Rent> {
    const currentRent = await this.repo.findOneOrFail({ where: { id: rentId }, relations: {asset: true} });
    if (canChangeState(currentRent.rentState, newState) == false) {
      throw new BadRequestException('???? ???????? ?????????? ???????? ??????????');
    }
    await this.rentStateTransService.create({
      createdById: userId,
      rentId: currentRent.id,
      state: newState,
    });
    const rent = await this.repo.save(this.repo.create({ ...currentRent, rentState: newState, updatedById: userId }));
    this.eventEmitter.emit(EVENT_RENT_STATE_CHANGED, rent);
    return rent;
  }

  async update(id: number, dto: UpdateRentDto, userId: number): Promise<Rent> {
    const row = await this.repo.findOneOrFail({ where: { id } });
    return this.repo.save(this.repo.create({ ...row, ...dto, updatedById: userId }));
  }

  remove(id: number): Promise<DeleteResult> {
    return this.repo.delete({ id });
  }
}
