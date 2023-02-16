import { CurrentUser } from '@/accounts/decorators/current-user.decorator';
import { UpdateUserDto } from '@/accounts/dto/update-user.dto';
import { JwtAuthGuard } from '@/accounts/guards/jwt-auth.guard';
import { UsersService } from '@/accounts/services/users.service';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@Controller('me')
@ApiTags('me')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserMeController {
  constructor(
    private service: UsersService,
  ) { }

  @Get()
  async getCurrentCustomer(@CurrentUser('id') customerId: number) {
    return this.service.findOne(customerId);
  }

  @Patch()
  async updateCurrentCustomer(
    @CurrentUser('id') userId: number,
    @Body() dto: UpdateUserDto,
  ) {
    // PREVENT APP FROM BECOMING ADMIN
    delete dto.isAdmin;
    delete dto.isActive;
    return this.service.update(userId, dto);
  }


  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @CurrentUser('id') customerId: number,
    @UploadedFile(new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
      ]
    })) file: Express.Multer.File,
  ) {
    if (file.mimetype.startsWith('image') == false) {
      throw new HttpException('invalid file type', HttpStatus.BAD_REQUEST);
    }
    return this.service.updateProfilePicture(customerId, file)
  }
}
