import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { SubscriptionsService } from '../../../gebril_videos/services/subscriptions.service';
import { CreateSubscriptionDto } from '../../../gebril_videos/dto/create-subscription.dto';
import { UpdateSubscriptionDto } from '../../../gebril_videos/dto/update-subscription.dto';
import { CurrentUser } from '@/accounts/decorators/current-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/accounts/guards/jwt-auth.guard';
import { PaginatedDataQueryDto } from '@/shared/dto/paginated-data.dto';
import { UserSubscribeDto } from '@/gebril_videos/dto/user-subscribe.dto';

@Controller('subscriptions')
@ApiTags('subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly service: SubscriptionsService) {}

  @Post()
  create(@Body() dto: UserSubscribeDto, @CurrentUser('id') userId: number) {
    return this.service.userSubscribe(userId, dto);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: number, @CurrentUser('id') userId: number) {
    return this.service.userCancel(userId, id);
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
}
