import { CurrentUser } from '@/accounts/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/accounts/guards/jwt-auth.guard';
import { AssetsService } from '@/eegar/services/assets.service';
import { PaginatedDataQueryDto } from '@/shared/dto/paginated-data.dto';
import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';


@Controller('assets')
@ApiTags('assets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AssetsController {
  constructor(private readonly service: AssetsService) { }

  @Get()
  findAll(@CurrentUser('id') userId: number) {
    return this.service.findAll();
  }

  @Get('paginated')
  findAllPaginated(@Query() dto: PaginatedDataQueryDto, @CurrentUser('id') userId: number) {
    return this.service.findAllPaginatedForApp(dto, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

}
