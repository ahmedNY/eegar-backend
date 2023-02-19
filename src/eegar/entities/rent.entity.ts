import { Customer } from '@/accounts/entities/customer.entity';
import { User } from '@/accounts/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { Asset } from './asset.entity';
import { Extension } from './extension.entity';
import { Payment } from './payment.entity';

export enum RentState {
    draft = 'draft',
    checkedIn = 'checkedIn',
    checkedOut = 'checkedOut',
}

@Entity()
export class Rent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    assetId: number;

    @ManyToOne(() => Asset)
    asset: Asset;

    @Column({nullable: true})
    customerId: number;

    @ManyToOne(() => Customer, { nullable: true })
    customer?: Customer;

    @Column()
    dateFrom: Date;

    @Column()
    numberOfNights: number;

    @OneToMany(() => Payment, payment => payment.rent)
    payments: Payment[];

    @OneToMany(() => Extension, extension => extension.rent)
    extensions: Extension[];

    @Column('double')
    price: number;

    @Column({ type: 'varchar', default: RentState.draft })
    rentState: RentState;

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
