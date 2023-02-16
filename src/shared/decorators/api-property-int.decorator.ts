import { applyDecorators } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptions } from "@nestjs/swagger";


export const ApiPropertyInt = (options?: ApiPropertyOptions) =>
    applyDecorators(
        ApiProperty({ ...options, type: 'integer' }),
    )