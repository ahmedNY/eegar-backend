import { ApiPropertyInt } from "@/shared/decorators/api-property-int.decorator";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsJSON, IsOptional, IsString } from "class-validator";

export enum SortingDirection {
    ASC = 'ASC',
    DESC = 'DESC',
}

export class PaginatedDataQueryDto {
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    @ApiPropertyInt({ required: false, default: 1 })
    page?: number = 1;

    @IsInt()
    @IsOptional()
    @Type(() => Number)
    @ApiPropertyInt({ required: false, default: 10 })
    limit?: number = 10;

    @IsString()
    @IsOptional()
    sort?: string = 'id';

    @IsEnum(SortingDirection)
    @IsOptional()
    sortingDirection?: SortingDirection;

    @IsJSON()
    @IsOptional()
    columns?: string;
}