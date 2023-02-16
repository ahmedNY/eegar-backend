import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { UsersController } from './controllers/users.controller';
import { AccountsModule } from 'src/accounts/accounts.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { SharedModule } from '@/shared/shared.module';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './controllers/auth.controller';
import { CategoriesController } from './controllers/categories.controller';
import { EegarModule } from '@/eegar/eegar.module';
import { PlansController } from './controllers/plans.controller';
import { SubscriptionsController } from './controllers/subscriptions.controller';
import { AssetsController } from './controllers/assets.controller';

@Module({
  imports: [
    AccountsModule,
    ConfigModule,
    EegarModule,
    HttpModule,
    NotificationsModule,
    SharedModule,
  ],
  controllers: [
    AuthController,
    CategoriesController,
    PlansController,
    SubscriptionsController,
    UsersController,
    AssetsController,
  ]
})
export class AdminGatewayModule { }
