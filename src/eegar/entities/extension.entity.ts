import { User } from '@/accounts/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Rent } from './rent.entity';

@Entity()
export class Extension {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    rentId: number;

    @ManyToOne(() => Rent)
    rent: Rent;

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
