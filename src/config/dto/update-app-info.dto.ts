import { PartialType } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { CreateAppInfoDto } from './create-app-info.dto';
import { OSType } from './os-types.enum';

export class UpdateAppInfoDto extends PartialType(CreateAppInfoDto) {
    @IsString()
    @IsOptional()
    versionTitle?: string;

    @IsString()
    @IsOptional()
    versionName?: string;

    @IsString()
    @IsOptional()
    versionCode?: string;

    @IsBoolean()
    @IsOptional()
    isRequired?: boolean;

    @IsString()
    @IsOptional()
    versionUrl?: string;

    @IsString()
    @IsOptional()
    termsUrl?: string;

    @IsString()
    @IsOptional()
    privacyUrl?: string;

    @IsString()
    @IsOptional()
    rateUrl?: string;

    @IsEnum(OSType)
    @IsOptional()
    osType?: OSType;
}
