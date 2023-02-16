import { IsOptional, IsString } from "class-validator";

export class SendSMSDto {
    @IsString()
    message: string;

    @IsString()
    phoneNumber: string;

    @IsString()
    @IsOptional()
    sender?: string;
}