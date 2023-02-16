import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ExtensionsService } from '../../../eegar/services/extensions.service';
import { CreateExtensionDto } from '../../../eegar/dto/create-extension.dto';
import { UpdateExtensionDto } from '../../../eegar/dto/update-extension.dto';
import { JwtAuthGuard } from '@/accounts/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@Controller('extensions')
@ApiTags('extensions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ExtensionsController {
  constructor(private readonly service: ExtensionsService) {}

  @Post()
  create(@Body() dto: CreateExtensionDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateExtensionDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
