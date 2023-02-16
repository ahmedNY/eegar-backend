import { IsEnum, IsString } from "class-validator";
import { OSType } from "./os-types.enum";

export class FindAppInfoDto {
    @IsEnum(OSType)
    osType: OSType;
}