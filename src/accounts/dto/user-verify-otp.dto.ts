import{ ApiPropertyInt } from "@/shared/decorators/api-property-int.decorator";
import { IsNumberString, MaxLength, MinLength } from "class-validator";

export class VerifyOtpDto {
    @IsNumberString()
    @MinLength(12)
    @MaxLength(12)
    phoneNumber: string;

    @IsNumberString()
    otpToken: string;
}