import { Customer } from '@/accounts/entities/customer.entity';
import { User } from '@/accounts/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Asset } from './asset.entity';

@Entity()
export class Rent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    assetId: number;

    @ManyToOne(() => Asset)
    asset: Asset;

    @Column()
    customerId: number;

    @ManyToOne(() => Customer)
    customer: Customer;

    @Column()
    dateFrom: Date;

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
