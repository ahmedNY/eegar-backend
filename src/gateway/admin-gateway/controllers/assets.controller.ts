import { CurrentUser } from '@/accounts/decorators/current-user.decorator';
import { IsAdminGuard } from '@/accounts/guards/is-admin.guard';
import { JwtAuthGuard } from '@/accounts/guards/jwt-auth.guard';
import { CreateAssetDto } from '@/eegar/dto/create-asset.dto';
import { UpdateAssetDto } from '@/eegar/dto/update-asset.dto';
import { AssetsService } from '@/eegar/services/assets.service';
import { PaginatedDataQueryDto } from '@/shared/dto/paginated-data.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UploadedFile, UseInterceptors, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';


@Controller('assets')
@ApiTags('assets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, IsAdminGuard)
export class AssetsController {
  constructor(private readonly service: AssetsService) { }

  @Post()
  create(@Body() dto: CreateAssetDto, @CurrentUser('id') userId: number) {
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

  @Get('home')
  findAllForHome() {
    return this.service.findAllForHomePage();
  }

  @Get('vacant')
  findVacant() {
    return this.service.findVacant();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAssetDto, @CurrentUser('id') userId: number) {
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
        new MaxFileSizeValidator({ maxSize: 1024 * 512 }),
      ],
    }),) file: Express.Multer.File,
  ) {
    return this.service.upload(id, type, file);
  }

}
