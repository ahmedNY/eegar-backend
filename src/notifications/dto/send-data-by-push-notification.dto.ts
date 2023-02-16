import { IsOptional, IsString } from "class-validator";

export class SendDataByPushNotificationDto {
    @IsString()
    registrationToken?: string;

    @IsString()
    data?: any;
}