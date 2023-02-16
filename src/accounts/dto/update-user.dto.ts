import { PartialType } from '@nestjs/mapped-types';
import { IsString, Max, IsEmail, IsOptional, Min, IsBoolean, IsArray, ArrayMinSize } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    @Max(50)
    @IsOptional()
    userName?: string;

    @IsEmail()
    @IsOptional()
    userEmail?: string;

    @IsString()
    @Max(50)
    @IsOptional()
    userPhone?: string;

    @IsString()
    @Min(6)
    @Max(255)
    @IsOptional()
    userPassword?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
