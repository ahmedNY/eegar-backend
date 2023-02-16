import { PartialType } from "@nestjs/mapped-types";
import { ArrayMinSize, IsArray, IsBoolean, IsEmail, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { User } from "../entities/user.entity";

export class CreateUserDto extends PartialType(User) {
    @IsString()
    @MaxLength(50)
    @IsOptional()
    fullName?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @MaxLength(12)
    @MinLength(12)
    phoneNumber?: string;
    
    @IsBoolean()
    @IsOptional()
    isActive: boolean;
}
