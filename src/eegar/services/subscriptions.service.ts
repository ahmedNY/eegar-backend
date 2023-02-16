import { PaginatedDataQueryDto } from '@/shared/dto/paginated-data.dto';
import { PaginatedResultDto } from '@/shared/dto/paginated-result.dto';
import { PaginatedDataService } from '@/shared/services/paginated-data.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { DeleteResult, MoreThan, Repository } from 'typeorm';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { UpdateSubscriptionDto } from '../dto/update-subscription.dto';
import { UserSubscribeDto } from '../dto/user-subscribe.dto';
import { Subscription } from '../entities/subscription.entity';
import { PlansService } from './plans.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription) private repo: Repository<Subscription>,
    private paginatedDataService: PaginatedDataService,
    private plansService: PlansService,
  ) { }

  create(userId: number, dto: CreateSubscriptionDto): Promise<Subscription> {
    return this.repo.save(this.repo.create({ ...dto, userId: userId }));
  }

  findAll(): Promise<Subscription[]> {
    return this.repo.find();
  }

  findOne(id: number): Promise<Subscription> {
    return this.repo.findOne({ where: { id } });
  }

  findAllPaginated(dto: PaginatedDataQueryDto): Promise<PaginatedResultDto<Subscription>> {
    return this.paginatedDataService.findAll(Subscription, dto, {
      relations: {
        plan: true,
        user: true,
      }
    });
  }

  async update(id: number, dto: UpdateSubscriptionDto): Promise<Subscription> {
    const row = await this.repo.findOneOrFail({ where: { id } });
    return this.repo.save(this.repo.create({ ...row, ...dto }));
  }

  remove(id: number): Promise<DeleteResult> {
    return this.repo.delete({ id });
  }

  async userIsSubscribed(userId: number): Promise<boolean> {
    const result = await this.repo.findOne({
      where: {
        userId: userId,
        expiredAt: MoreThan(new Date()),
        isCanceled: false,
      },
      cache: true
    });
    return result != null;
  }

  async userSubscribe(userId: number, dto: UserSubscribeDto): Promise<Subscription> {
    const plan = await this.plansService.findOne(dto.planId);
    if (plan == null) {
      throw new NotFoundException('Plan not found');
    }

    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + plan.duration);
    return this.repo.save(this.repo.create({
      planId: plan.id,
      price: plan.price,
      duration: plan.duration,
      userId: userId,
      startFrom: new Date(),
      expiredAt: expiredAt,
    }));
  }

  async userCancel(userId: number, id: number): Promise<Subscription> {
    const row = await this.repo.findOne({ where: { id, userId: userId } });
    if (row == null) {
      throw new NotFoundException('Subscription not found');
    }
    row.isCanceled = true;
    return this.repo.save(row);
  }

}
