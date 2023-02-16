import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './services/auth.service';
import { OtpService } from './services/otp.service';
import { Otp } from './entities/otp.entity';
import { ConfigModule } from 'src/config/config.module';
import { UsersService } from './services/users.service';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { JwtStrategy } from './services/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SharedModule } from 'src/shared/shared.module';


export async function getJwtModule() {
  await NestConfigModule.envVariablesLoaded;
  return JwtModule.register({
    secret: process.env.JWT_SECRET,
  });
}

const _exportedProviders = [
  AuthService,
  OtpService,
  UsersService,
];

const _exportedGuards = [
  JwtAuthGuard,
];

@Module({
  imports: [
    getJwtModule(),
    TypeOrmModule.forFeature([
      Otp,
      User,
    ]),
    SharedModule,
    ConfigModule,
  ],
  providers: [
    ..._exportedProviders,
    ..._exportedGuards,
    JwtStrategy,
  ],
  exports: [
    TypeOrmModule,
    ..._exportedProviders,
    ..._exportedGuards,
  ]
})
export class AccountsModule { }
