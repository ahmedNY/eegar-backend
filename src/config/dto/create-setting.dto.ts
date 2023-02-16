import { PartialType } from "@nestjs/mapped-types";
import { IsString, IsObject } from "class-validator";
import { Setting } from "../entities/setting.entity";

export class CreateSettingDto extends PartialType(Setting) {
    @IsString()
    settingName: string;

    @IsObject()
    settingValue: object;

}
