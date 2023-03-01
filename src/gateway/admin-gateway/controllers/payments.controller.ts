import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { PaymentsService } from '../../../eegar/services/payments.service';
import { CreatePaymentDto } from '../../../eegar/dto/create-payment.dto';
import { UpdatePaymentDto } from '../../../eegar/dto/update-payment.dto';
import { JwtAuthGuard } from '@/accounts/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CurrentUser } from '@/accounts/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginatedDataQueryDto } from '@/shared/dto/paginated-data.dto';

@Controller('payments')
@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly service: PaymentsService) { }

  @Post()
  create(@Body() dto: CreatePaymentDto, @CurrentUser('id') userId: number) {
    return this.service.create(dto, userId);
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
  update(@Param('id') id: string, @Body() dto: UpdatePaymentDto, @CurrentUser('id') userId: number) {
    return this.service.update(+id, dto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Post('/upload/:id/:type')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @Param('id') id: number,
    @Param('type') type: string,
    @UploadedFile(new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
      ],
    }),) file: Express.Multer.File,
  ) {
    return this.service.upload(id, type, file);
  }
}
