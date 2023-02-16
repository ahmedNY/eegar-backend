import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CategoriesService } from '../../../gebril_videos/services/categories.service';
import { CreateCategoryDto } from '../../../gebril_videos/dto/create-category.dto';
import { UpdateCategoryDto } from '../../../gebril_videos/dto/update-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/accounts/guards/jwt-auth.guard';
import { PaginatedDataQueryDto } from '@/shared/dto/paginated-data.dto';
import { CurrentUser } from '@/accounts/decorators/current-user.decorator';
import { IsAdminGuard } from '@/accounts/guards/is-admin.guard';

@Controller('categories')
@ApiTags('categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, IsAdminGuard)
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Post()
  create(@CurrentUser('id') userId: number, @Body() dto: CreateCategoryDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
