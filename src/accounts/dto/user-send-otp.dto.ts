import { IsNumberString, MaxLength, MinLength } from "class-validator";

export class UserSendOtpDto {
    @IsNumberString()
    @MinLength(12, { message: 'customerPhone must be valid 249XXXXXXXXX' })
    @MaxLength(12, { message: 'customerPhone must be valid 249XXXXXXXXX' })
    phoneNumber: string;
}