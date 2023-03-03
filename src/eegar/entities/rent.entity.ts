import { Customer } from '@/accounts/entities/customer.entity';
import { User } from '@/accounts/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { Asset } from './asset.entity';
import { Broker } from './broker.entity';
import { Extension } from './extension.entity';
import { Payment } from './payment.entity';
import { RentState } from './rent-state';
import { RentStateTrans } from './rent-state.entity';

@Entity()
export class Rent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    assetId: number;

    @ManyToOne(() => Asset)
    asset: Asset;

    @Column({ nullable: true })
    customerId: number;

    @ManyToOne(() => Customer, { nullable: true })
    customer?: Customer;

    @Column({ nullable: true })
    brokerId: number;

    @ManyToOne(() => Broker, { nullable: true })
    broker?: Broker;

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

    @Column('double')
    brokerCommission: number;

    @Column({ type: 'varchar', default: RentState.draft })
    rentState: RentState;

    @OneToMany(() => RentStateTrans, (trans) => trans.rent)
    transitions: RentStateTrans[];

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
