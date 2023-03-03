import { IsEnum, IsNumber } from "class-validator";
import { RentState } from "../entities/rent-state";

export class CreateRentStateTransDto {
    @IsNumber()
    rentId: number;

    @IsNumber()
    createdById: number;

    @IsEnum({ enum: RentState })
    state: RentState;
}