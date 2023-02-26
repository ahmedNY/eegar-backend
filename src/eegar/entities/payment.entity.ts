import { User } from '@/accounts/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Extension } from './extension.entity';
import { Rent } from './rent.entity';

export enum PaymentType {
    mBok = 'mBok',
    cash = 'cash',
}

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    rentId?: number;

    @ManyToOne(() => Rent, { nullable: true })
    rent?: Rent;

    @Column({ nullable: true })
    extensionId?: number;

    @OneToOne(() => Extension, extension => extension.payment, { nullable: true })
    @JoinColumn()
    extension?: Extension;

    @Column('double')
    amount: number;

    @Column()
    note: string;

    @Column({ type: 'enum', enum: PaymentType })
    paymentType: PaymentType;

    @Column({ nullable: true })
    photo?: string;

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
