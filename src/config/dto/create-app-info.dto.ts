import { PartialType } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { AppInfo } from "../entities/app-info.entity";

export class CreateAppInfoDto extends PartialType(AppInfo) {
    @IsString()
    versionTitle: string;

    @IsString()
    versionName: string;

    @IsString()
    versionCode: string;

    @IsBoolean()
    isRequired: boolean;

    @IsString()
    versionUrl: string;

    @IsString()
    termsUrl: string;

    @IsString()
    privacyUrl: string;

    @IsString()
    rateUrl: string;

    @IsString()
    osType: string;
}