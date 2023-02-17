import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { authenticator } from "otplib";
import { ConfigService } from '@nestjs/config';
import { hash, compare } from "bcryptjs";
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from './otp.service';
import { VerifyOtpDto } from '../dto/user-verify-otp.dto';
import { UserLoginResponseDto } from '../dto/user-login-response.dto';
import { UserSendOtpDto } from '../dto/user-send-otp.dto';
import { UsersService } from './users.service';
import { EVENT_USER_RESEND_OTP } from '@/events';
import { SettingsService } from '@/config/services/settings.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';

authenticator.options = {
    digits: 4,
}

@Injectable()
export class AuthService {
    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
        private otpService: OtpService,
        private settingsService: SettingsService,
        private usersService: UsersService,
        private eventEmitter: EventEmitter2,
    ) { }

    async sendOTP(dto: UserSendOtpDto) {
        const user = await this.usersService.findOneByPhoneNumber(dto.phoneNumber);
        
        if (!user) {
            throw new ForbiddenException('User not registered!, contact app admin');
        }
        
        // search for existing otp on database
        const otp = await this.otpService.findOne({
            phoneNumber: dto.phoneNumber,
        })

        if (otp) {
            return this.resend(dto);
        }

        //generate otp token
        let token: string = this.generateOTPToken();

        // it customer is tester we change token value to default testers otp
        if (this.configService.get('NODE_ENV') == 'development') {
            token = '0000';
        }

        // create OTP
        await this.otpService.create({
            otpToken: token,
            phoneNumber: dto.phoneNumber,
        });

        return true;
    }

    async verifyOtp(dto: VerifyOtpDto): Promise<UserLoginResponseDto> {
        const { phoneNumber, otpToken } = dto;

        if (dto.otpToken != '0000') {
            const isValidOtp = authenticator.verify({
                token: dto.otpToken,
                secret: this.configService.get('OTP_SECRET'),
            })
            if (isValidOtp!) {
                throw new ForbiddenException('Invalid OTP');
            }
        }

        const isValid = await this.otpService.findOne({ phoneNumber, otpToken })

        if (!isValid) {
            throw new ForbiddenException('Invalid OTP token');
        }
        
        const user = await this.usersService.findOneByPhoneNumber(phoneNumber);

        if (!user) {
            throw new NotFoundException('User not found!');
        }

        // delete otp
        await this.otpService.removeByPhoneNumber(phoneNumber);
        const token = this.generateUserAuthToken(user);

        return {
            user: user,
            token: token,
        }
    }


    async resend(dto: UserSendOtpDto): Promise<boolean> {
        if (this.configService.get('NODE_ENV') == 'development') {
            return true;
        }

        const otp = await this.otpService.findOne({
            phoneNumber: dto.phoneNumber,
        })

        const otpResendLimit = await this.settingsService.getOTPResendLimit();
        if (otp.send_retries >= otpResendLimit) {
            throw Error('You reached maximum amount for resend');
        }

        await this.otpService.update(
            otp.id,
            {
                send_retries: otp.send_retries + 1
            },
        );

        this.eventEmitter.emit(EVENT_USER_RESEND_OTP, otp)

        return true;
    }

    verify(token: string): Promise<JwtPayloadDto> {
        return this.jwtService.verify(token);
    }

    generateOTPToken(): string {
        return authenticator.generate(this.configService.get('OTP_SECRET'));
    }

    generateUserAuthToken(user: Partial<User>): string {
        return this.jwtService.sign({
            id: user.id,
        }, {
            secret: this.configService.get('JWT_SECRET'),
        });
    }

    hashPassword(password: string): Promise<string> {
        return hash(password, 8)
    }

    comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
        return compare(password, hashedPassword);
    }
}