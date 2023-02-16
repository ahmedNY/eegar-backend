import { Controller, Post, Body } from '@nestjs/common';
import { VerifyOtpDto } from '@/accounts/dto/user-verify-otp.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '@/accounts/services/auth.service';
import { UserSendOtpDto } from '@/accounts/dto/user-send-otp.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly service: AuthService) { }

  @Post('send-otp')
  async sendOtp(@Body() dto: UserSendOtpDto) {
      return this.service.adminSendOTP(dto)
  }

  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
      return this.service.adminVerifyOtp(dto)
  }
}
