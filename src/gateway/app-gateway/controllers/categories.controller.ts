import { Controller, Get, UseGuards } from '@nestjs/common';
import { CategoriesService } from '../../../gebril_videos/services/categories.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/accounts/guards/jwt-auth.guard';

@Controller('categories')
@ApiTags('categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Get()
  findAll() {
    return this.service.userFindAll();
  }
  
}
