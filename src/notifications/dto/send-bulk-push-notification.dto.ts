import { IsArray, IsOptional, IsString } from "class-validator";

export class SendBulkPushNotificationDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    body?: string;

    @IsArray()
    registrationTokens: string[];

    @IsString()
    @IsOptional()
    click_action?: string;

    @IsString()
    @IsOptional()
    data?: any;

    @IsString()
    @IsOptional()
    image?: string;

    @IsString()
    @IsOptional()
    timeToLive?: string;
}