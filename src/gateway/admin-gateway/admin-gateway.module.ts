import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { UsersController } from './controllers/users.controller';
import { AccountsModule } from 'src/accounts/accounts.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { SharedModule } from '@/shared/shared.module';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './controllers/auth.controller';
import { EegarModule } from '@/eegar/eegar.module';
import { AssetsController } from './controllers/assets.controller';
import { CustomersController } from './controllers/customers.controller';
import { RentsController } from './controllers/rents.controller';
import { ExtensionsController } from './controllers/extensions.controller';
import { BrokersController } from './controllers/brokers.controller';

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
    BrokersController,
    UsersController,
    AssetsController,
    CustomersController,
    RentsController,
    ExtensionsController,
  ]
})
export class AdminGatewayModule { }
