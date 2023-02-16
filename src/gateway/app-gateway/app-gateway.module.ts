import { AccountsModule } from '@/accounts/accounts.module';
import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { UserMeController } from './controllers/user-me.controller';
import { ConfigModule } from '@/config/config.module';
import { NotificationsModule } from '@/notifications/notifications.module';
import { ConfigController } from './controllers/config.controller';
import { AssetsController } from './controllers/assets.controller';
import { EegarModule } from '@/eegar/eegar.module';
import { PlansController } from './controllers/plans.controller';
import { SubscriptionsController } from './controllers/subscriptions.controller';
import { CategoriesController } from './controllers/categories.controller';


@Module({
    imports: [
        AccountsModule,
        ConfigModule,
        EegarModule,
        NotificationsModule,
    ],
    controllers: [
        AuthController,
        CategoriesController,
        ConfigController,
        PlansController,
        SubscriptionsController,
        UserMeController,
        AssetsController,
    ],
})
export class AppGatewayModule { }
