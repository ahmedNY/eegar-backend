import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { UsersController } from './controllers/users.controller';
import { AccountsModule } from 'src/accounts/accounts.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { SharedModule } from '@/shared/shared.module';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './controllers/auth.controller';
import { EegarModule } from '@/eegar/eegar.module';
import { BillsController } from './controllers/bills.controller';
import { NotificationsController } from './controllers/notifications.controller';

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
    BillsController,
    UsersController,
    NotificationsController,
  ]
})
export class AdminGatewayModule { }
