import { User } from '@/accounts/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { RentState } from './rent-state';
import { Rent } from './rent.entity';

@Entity()
export class RentStateTrans {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    state: RentState;
    
    @Column()
    rentId: number;

    @ManyToOne(() => Rent)
    rent: Rent;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    createdById: number;

    @ManyToOne(() => User)
    createdBy: User;
}
