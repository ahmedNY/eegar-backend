import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SMSService } from './services/sms.service';
import { AccountsModule } from 'src/accounts/accounts.module';
import { FirebaseService } from './services/firebase.service';
import { EmailService } from './services/email.service';
import { SMSListeners } from './listeners/sms.listeners';
import { ConfigModule } from '@/config/config.module';
import { SharedModule } from '@/shared/shared.module';
import { FirebaseListeners } from './listeners/firebase.listeners';

const _exportedProviders = [
    EmailService,
    FirebaseService,
    SMSService,
];

@Module({
    imports: [
        HttpModule,
        AccountsModule,
        ConfigModule,   
        SharedModule,
    ],
    providers: [
        ..._exportedProviders,
        SMSListeners,
        FirebaseListeners,
    ],
    exports: [
        ..._exportedProviders,
    ],
})
export class NotificationsModule { }
