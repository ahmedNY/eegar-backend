import { CurrentUser } from '@/accounts/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/accounts/guards/jwt-auth.guard';
import { CreateBillDto } from '@/eegar/dto/create-bill.dto';
import { UpdateBillDto } from '@/eegar/dto/update-bill.dto';
import { BillsService } from '@/eegar/services/bills.service';
import { PaginatedDataQueryDto } from '@/shared/dto/paginated-data.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UploadedFile, UseInterceptors, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';


@Controller('bills')
@ApiTags('bills')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class BillsController {
  constructor(private readonly service: BillsService) { }

  @Post()
  create(@Body() dto: CreateBillDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateBillDto) {
    return this.service.update(+id, dto);
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
        new MaxFileSizeValidator({ maxSize: 1024 * 512 }),
      ],
    }),) file: Express.Multer.File,
  ) {
    return this.service.upload(id, type, file);
  }

}
