import { ApiPropertyInt } from "@/shared/decorators/api-property-int.decorator";;
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Otp {
    @PrimaryGeneratedColumn()
    @ApiPropertyInt({required: true })
    id: number;

    @Column()
    phoneNumber: string;

    @Column()
    otpToken: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    send_time: string;

    @Column({ default: 0 })
    @ApiPropertyInt({required: true })
    send_retries: number;
}
