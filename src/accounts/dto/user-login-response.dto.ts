import { User } from "../entities/user.entity";

export class UserLoginResponseDto {
    user: User;
    token: string;
  }