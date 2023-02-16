import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { SubscriptionsService } from '../../../gebril_videos/services/subscriptions.service';
import { CreateSubscriptionDto } from '../../../gebril_videos/dto/create-subscription.dto';
import { UpdateSubscriptionDto } from '../../../gebril_videos/dto/update-subscription.dto';
import { CurrentUser } from '@/accounts/decorators/current-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/accounts/guards/jwt-auth.guard';
import { PaginatedDataQueryDto } from '@/shared/dto/paginated-data.dto';
import { IsAdminGuard } from '@/accounts/guards/is-admin.guard';

@Controller('subscriptions')
@ApiTags('subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, IsAdminGuard)
export class SubscriptionsController {
  constructor(private readonly service: SubscriptionsService) {}

  @Post()
  create(@Body() dto: CreateSubscriptionDto, @CurrentUser('id') userId: number) {
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
  update(@Param('id') id: string, @Body() dto: UpdateSubscriptionDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
