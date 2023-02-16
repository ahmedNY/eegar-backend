import { JwtAuthGuard } from '@/accounts/guards/jwt-auth.guard';
import { CreateRentDto } from '@/eegar/dto/create-rent.dto';
import { UpdateRentDto } from '@/eegar/dto/update-rent.dto';
import { RentsService } from '@/eegar/services/rents.service';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@Controller('rents')
@ApiTags('rents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class RentsController {
  constructor(private readonly service: RentsService) {}

  @Post()
  create(@Body() dto: CreateRentDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateRentDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
