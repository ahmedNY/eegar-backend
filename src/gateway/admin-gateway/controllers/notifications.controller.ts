import { JwtAuthGuard } from '@/accounts/guards/jwt-auth.guard';
import { SendPushNotificationDto } from '@/notifications/dto/send-push-notification.dto';
import { FirebaseService } from '@/notifications/services/firebase.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiTags('notifications')
@ApiBearerAuth()
export class NotificationsController {
    constructor(
        private firebaseService: FirebaseService,
    ) { }

    @Post('push')
    create(@Body() dto: SendPushNotificationDto) {
        return this.firebaseService.sendPushNotification(dto);
    }
}