import { CurrentUser } from '@/accounts/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/accounts/guards/jwt-auth.guard';
import { CreatePlanDto } from '@/gebril_videos/dto/create-plan.dto';
import { UpdatePlanDto } from '@/gebril_videos/dto/update-plan.dto';
import { PlansService } from '@/gebril_videos/services/plans.service';
import { PaginatedDataQueryDto } from '@/shared/dto/paginated-data.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@Controller('plans')
@ApiTags('plans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PlansController {
  constructor(private readonly service: PlansService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('paginated')
  findAllPaginated(@Query() dto: PaginatedDataQueryDto) {
    return this.service.findAllPaginated(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

}
