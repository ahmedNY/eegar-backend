import { UsersService } from '@/accounts/services/users.service';
import { Asset } from '@/eegar/entities/asset.entity';
import { RentState } from '@/eegar/entities/rent-state';
import { Rent } from '@/eegar/entities/rent.entity';
import { EVENT_IS_LEAVING_TODAY, EVENT_IS_LEAVING_TOMORROW, EVENT_IS_OVERDUE, EVENT_RENT_CREATED, EVENT_RENT_STATE_CHANGED } from '@/events';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FirebaseService } from '../services/firebase.service';

@Injectable()
export class FirebaseListeners {
    constructor(
        private firebaseService: FirebaseService,
        private usersService: UsersService,
    ) { }

    @OnEvent(EVENT_RENT_CREATED)
    async onRentCreated(rent: Rent) {
        // const registrationTokens = await this.usersService.getAdminsFBTokens();
        // this.firebaseService.sendBulkPushNotification({
        //     title: "ايجار جديد",
        //     body: `تم ايجار ${rent.asset.assetName}`,
        //     registrationTokens: registrationTokens,
        //     data: rent,
        // });
    }

    @OnEvent(EVENT_RENT_STATE_CHANGED)
    async onRentStateChanged(rent: Rent) {
        let registrationTokens = await this.usersService.getAdminsFBTokens();
        let body = "";
        switch (rent.rentState) {
            case RentState.canceled:
                body = 'تم الغاء الايجار';
                break;
            case RentState.checkedIn:
                body = 'تم تسليم الشقة';
                break;
            case RentState.checkedOut:
                body = 'تم استلام مفاتيح الشقة';
                break;
            default:
                break;
        }
        this.firebaseService.sendBulkPushNotification({
            title: rent.asset.assetName,
            body: body,
            registrationTokens: registrationTokens,
            data: rent,
        });
    }

    @OnEvent(EVENT_IS_LEAVING_TODAY)
    async onIsLeavingToday(asset: Asset) {
        let registrationTokens = await this.usersService.getAllFBTokens();
        this.firebaseService.sendBulkPushNotification({
            title: asset.assetName,
            body: "الزبون مغادر اليوم",
            registrationTokens: registrationTokens,
            data: asset,
        });
    }

    @OnEvent(EVENT_IS_LEAVING_TOMORROW)
    async onIsLeavingTomorrow(asset: Asset) {
        let registrationTokens = await this.usersService.getAllFBTokens();
        this.firebaseService.sendBulkPushNotification({
            title: asset.assetName,
            body: "الزبون مغادر غدا",
            registrationTokens: registrationTokens,
            data: asset,
        });
    }

    @OnEvent(EVENT_IS_OVERDUE)
    async onIsOverdue(asset: Asset) {
        let registrationTokens = await this.usersService.getAllFBTokens();
        this.firebaseService.sendBulkPushNotification({
            title: asset.assetName,
            body: "الزبون متعدي: تخطى ايام المكوث",
            registrationTokens: registrationTokens,
            data: asset,
        });
    }
}
