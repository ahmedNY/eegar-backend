import { CustomersService } from '@/accounts/services/customers.service';
import { CreateCustomerDto } from '@/accounts/dto/create-customer.dto';
import { UpdateCustomerDto } from '@/accounts/dto/update-customer.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/accounts/guards/jwt-auth.guard';
import { CurrentUser } from '@/accounts/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('customers')
@ApiTags('customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly service: CustomersService) { }

  @Post()
  create(@Body() dto: CreateCustomerDto, @CurrentUser('id') userId: number) {
    return this.service.create(dto, userId);
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
  update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
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
