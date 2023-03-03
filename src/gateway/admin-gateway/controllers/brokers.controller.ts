import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BrokersService } from '../../../eegar/services/brokers.service';
import { CreateBrokerDto } from '../../../eegar/dto/create-broker.dto';
import { UpdateBrokerDto } from '../../../eegar/dto/update-broker.dto';
import { IsAdminGuard } from '@/accounts/guards/is-admin.guard';
import { JwtAuthGuard } from '@/accounts/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@Controller('brokers')
@ApiTags('brokers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, IsAdminGuard)
export class BrokersController {
  constructor(private readonly service: BrokersService) {}

  @Post()
  create(@Body() dto: CreateBrokerDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateBrokerDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
