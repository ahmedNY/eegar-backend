import { AccountsModule } from '@/accounts/accounts.module';
import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { UserMeController } from './controllers/user-me.controller';
import { ConfigModule } from '@/config/config.module';
import { NotificationsModule } from '@/notifications/notifications.module';
import { ConfigController } from '../admin-gateway/controllers/config.controller';
import { EegarModule } from '@/eegar/eegar.module';
import { AssetsController } from '../admin-gateway/controllers/assets.controller';
import { RentsController } from '../admin-gateway/controllers/rents.controller';
import { PaymentsController } from '../admin-gateway/controllers/payments.controller';


@Module({
    imports: [
        AccountsModule,
        ConfigModule,
        EegarModule,
        NotificationsModule,
    ],
    controllers: [
        AssetsController,
        AuthController,
        ConfigController,
        PaymentsController,
        RentsController,
        UserMeController,
    ],
})
export class AppGatewayModule { }
