import { VerifyOtpDto } from '@/accounts/dto/user-verify-otp.dto';
import { UserSendOtpDto } from '@/accounts/dto/user-send-otp.dto';
import { AuthService } from '@/accounts/services/auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        private service: AuthService,
    ) { }

    @Post('send-otp')
    async sendOtp(@Body() dto: UserSendOtpDto) {
        return this.service.sendOTP(dto)
    }

    @Post('verify-otp')
    async verifyOtp(@Body() dto: VerifyOtpDto) {
        return this.service.verifyOtp(dto)
    }
}