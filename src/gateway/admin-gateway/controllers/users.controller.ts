import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from '../../../accounts/services/users.service';
import { CreateUserDto } from '../../../accounts/dto/create-user.dto';
import { UpdateUserDto } from '../../../accounts/dto/update-user.dto';
import { JwtAuthGuard } from 'src/accounts/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/accounts/decorators/current-user.decorator';
import { IsAdminGuard } from '@/accounts/guards/is-admin.guard';

@Controller('users')
@ApiTags('users')
@UseGuards(JwtAuthGuard, IsAdminGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findCurrentUser(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Patch('me')
  updateMyProfile(@CurrentUser() user, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user.id, updateUserDto);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Get('reports/userCount')
  userCountReport(@Param('id') id: number) {
    return this.usersService.getUsersCountReport();
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
