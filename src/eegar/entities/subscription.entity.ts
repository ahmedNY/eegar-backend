import { User } from '@/accounts/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Plan } from './plan.entity';

@Entity()
export class Subscription {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @ManyToOne(() => User)
    user: User;

    @Column()
    planId: number;

    @ManyToOne(() => Plan)
    plan: Plan;

    @Column('double')
    price: number;

    @Column()
    duration: number;

    @Column()
    startFrom: Date;

    @Column()
    expiredAt: Date;

    @Column({ default: false })
    isCanceled: boolean;
}
