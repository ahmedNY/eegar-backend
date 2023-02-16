import { IsNumber } from "class-validator";

export class UserSubscribeDto {
    @IsNumber()
    planId: number;
}
