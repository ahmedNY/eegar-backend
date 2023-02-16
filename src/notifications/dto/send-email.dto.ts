import { IsString } from "class-validator";

export class SendEmailDto {
    @IsString()
    subject: string;

    @IsString()
    message: string;

    @IsString()
    toEmail: string;
}