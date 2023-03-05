import { SendPushNotificationDto } from '@/notifications/dto/send-push-notification.dto';
import { FirebaseService } from '@/notifications/services/firebase.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('notifications')
export class NotificationsController {
    constructor(
        private firebaseService: FirebaseService,
    ) { }

    @Post('push')
    create(@Body() dto: SendPushNotificationDto) {
        return this.firebaseService.sendPushNotification(dto);
    }
}