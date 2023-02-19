import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PaymentsService } from '../../../eegar/services/payments.service';
import { CreatePaymentDto } from '../../../eegar/dto/create-payment.dto';
import { UpdatePaymentDto } from '../../../eegar/dto/update-payment.dto';
import { JwtAuthGuard } from '@/accounts/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@Controller('payments')
@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post()
  create(@Body() dto: CreatePaymentDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdatePaymentDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
