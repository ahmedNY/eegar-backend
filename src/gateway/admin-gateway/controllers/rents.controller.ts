import { CurrentUser } from '@/accounts/decorators/current-user.decorator';
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
  constructor(private readonly service: RentsService) { }

  @Post()
  create(@Body() dto: CreateRentDto, @CurrentUser('id') userId: number) {
    return this.service.create(dto, userId);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('reports/monthlyOccupation/:assetId/:year')
  findMonthlyOccupationReport(@Param('assetId') assetId: number, @Param('year') year: number,) {
    return this.service.findMonthlyOccupationReport(assetId, year);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }


  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @CurrentUser('id') userId: number) {
    return this.service.cancel(+id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRentDto, @CurrentUser('id') userId: number) {
    return this.service.update(+id, dto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
