import { IsOptional, IsString } from "class-validator";

export class SendPushNotificationDto {
    @IsString()
    title: string;

    @IsString()
    text: string;

    @IsString()
    to: string;

    @IsString()
    @IsOptional()
    click_action?: string;

    @IsString()
    @IsOptional()
    data?: any;

    @IsString()
    @IsOptional()
    image?: string;
}