import { CurrentUser } from '@/accounts/decorators/current-user.decorator';
import { IsAdminGuard } from '@/accounts/guards/is-admin.guard';
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
@UseGuards(JwtAuthGuard, IsAdminGuard)
export class PlansController {
  constructor(private readonly service: PlansService) {}

  @Post()
  create(@Body() dto: CreatePlanDto, @CurrentUser('id') userId: number) {
    return this.service.create(userId, dto);
  }

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
