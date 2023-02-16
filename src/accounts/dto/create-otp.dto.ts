import { PartialType } from "@nestjs/swagger";
import { Otp } from "../entities/otp.entity";

export class CreateOtpDto extends PartialType(Otp) {}
