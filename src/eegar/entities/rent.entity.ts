import { Customer } from '@/accounts/entities/customer.entity';
import { User } from '@/accounts/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { Asset } from './asset.entity';
import { Broker } from './broker.entity';
import { Extension } from './extension.entity';
import { Payment } from './payment.entity';
import { RentState } from './rent-state';
import { RentStateTrans } from './rent-state.entity';
import * as moment from 'moment-timezone';

export const CHECKOUT_HOUR = 14; // 02:00 pm
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


    get checkoutDate(): Date {
        let checkout = new Date(this.dateFrom.getTime());
        checkout.setDate(checkout.getDate() + this.numberOfNights);
        if (this.extensions?.length > 0) {
            const extraDays = this.extensions
                ?.map((e) => e.numberOfNights)
                .reduce((value, element) => value + element);
            checkout.setDate(checkout.getDate() + extraDays);
        }
        return checkout;
    }

    private get _getTodayCheckout(): Date {
        const now = new Date();
        now.setHours(CHECKOUT_HOUR, 0, 0);
        return now;
    }

    get isCheckedIn(): boolean {
        return this.rentState == RentState.checkedIn;
    }

    get isOverdue(): boolean {
        if (this.isCheckedIn == false) return false;
        const leaveDate = this._getTodayCheckout;
        return moment(leaveDate).isAfter(moment(this.checkoutDate));
    }

    get isLeavingToday(): boolean {
        if (this.isCheckedIn == false) return false;
        const leaveDate = this._getTodayCheckout;
        const checkoutDate = this.checkoutDate;
        return leaveDate.getDate() == checkoutDate.getDate() &&
            leaveDate.getMonth() == checkoutDate.getMonth() &&
            leaveDate.getFullYear() == checkoutDate.getFullYear();
    }

    get isLeavingTomorrow(): boolean {
        if (this.isCheckedIn == false) return false;
        const leaveDate = this._getTodayCheckout;
        leaveDate.setDate(leaveDate.getDate() + 1);
        const checkoutDate = this.checkoutDate;
        return leaveDate.getDate() == checkoutDate.getDate() &&
            leaveDate.getMonth() == checkoutDate.getMonth() &&
            leaveDate.getFullYear() == checkoutDate.getFullYear();
    }

}
