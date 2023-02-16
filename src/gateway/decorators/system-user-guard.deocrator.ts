import { JwtAuthGuard } from "@/accounts/guards/jwt-auth.guard";
import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

export const SystemUserGuard = () => applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth()
)