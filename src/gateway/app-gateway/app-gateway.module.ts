import { AccountsModule } from '@/accounts/accounts.module';
import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { UserMeController } from './controllers/user-me.controller';
import { ConfigModule } from '@/config/config.module';
import { NotificationsModule } from '@/notifications/notifications.module';
import { ConfigController } from '../admin-gateway/controllers/config.controller';
import { EegarModule } from '@/eegar/eegar.module';
import { BillsController } from '../admin-gateway/controllers/bills.controller';

@Module({
    imports: [
        AccountsModule,
        ConfigModule,
        EegarModule,
        NotificationsModule,
    ],
    controllers: [
        AuthController,
        BillsController,
        ConfigController,
        UserMeController,
    ],
})
export class AppGatewayModule { }
