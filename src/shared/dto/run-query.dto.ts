import { IsOptional, IsString } from "class-validator";

export class RunQueryDto {
    @IsString()
    queryName: string;

    @IsOptional()
    args: any
}