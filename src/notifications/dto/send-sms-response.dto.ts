import{ ApiPropertyInt } from "@/shared/decorators/api-property-int.decorator";

export class SendSMSResponseDto {
    @ApiPropertyInt({required: true })
    success: number;
    @ApiPropertyInt({required: true })
    failed: number;
}