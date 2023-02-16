import { ApiPropertyInt } from "../decorators/api-property-int.decorator";

export class PaginatedResultDto<T> {
    docs: T[];
    
    @ApiPropertyInt({ required: true })
    pages: number;
    
    @ApiPropertyInt({ required: true })
    total: number;
}