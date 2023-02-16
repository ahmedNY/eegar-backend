import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Plan } from './entities/plan.entity';
import { Subscription } from './entities/subscription.entity';
import { Asset } from './entities/asset.entity';
import { CategoriesService } from './services/categories.service';
import { PlansService } from './services/plans.service';
import { SubscriptionsService } from './services/subscriptions.service';
import { AssetsService } from './services/assets.service';

const exportedServices = [
  CategoriesService,
  PlansService,
  SubscriptionsService,
  AssetsService,
];

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([
      Category,
      Plan,
      Subscription,
      Asset,
    ]),
  ],
  providers: [...exportedServices],
  exports: [...exportedServices]
})
export class EegarModule {}
