import { User } from '@/accounts/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToOne } from 'typeorm';
import { Payment } from './payment.entity';
import { Rent } from './rent.entity';

@Entity()
export class Extension {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    rentId: number;

    @ManyToOne(() => Rent)
    rent: Rent;

    @OneToOne(() => Payment, payment => payment.extension)
    payment: Payment;

    @Column()
    numberOfNights: number;

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn({ nullable: true })
    updatedAt?: Date;

    @Column()
    createdById: number;

    @ManyToOne(() => User)
    createdBy: User;

    @Column({ nullable: true })
    updatedById?: number;

    @ManyToOne(() => User, { nullable: true })
    updatedBy?: User;
}
