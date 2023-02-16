import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateSettingDto {
    @IsString()
    @IsOptional()
    settingName?: string;

    @IsObject()
    settingValue: object;
}
