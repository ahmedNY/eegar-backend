import { ApiPropertyInt } from "@/shared/decorators/api-property-int.decorator";

export class UsersCountDto {
    @ApiPropertyInt()
    usersCount: number;
    
    @ApiPropertyInt()
    maleUsersCount: number;
    
    @ApiPropertyInt()
    femaleUsersCount: number;
  }