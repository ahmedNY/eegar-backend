import { Type, applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { PaginatedResultDto } from "../dto/paginated-result.dto";

export const ApiOkResponsePaginated = <DataDto extends Type<unknown>>(dataDto: DataDto) =>
    applyDecorators(
        ApiExtraModels(() => PaginatedResultDto, dataDto),
        ApiExtraModels(dataDto),
        ApiOkResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(PaginatedResultDto) },
                    {
                        properties: {
                            docs: {
                                type: 'array',
                                items: { $ref: getSchemaPath(dataDto) },
                            },
                            pages: {
                                type: 'integer',
                            },
                            total: {
                                type: 'integer',
                            },
                        },
                    },
                ],
            },
        })
    )