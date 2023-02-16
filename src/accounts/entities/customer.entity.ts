import { Rent } from '@/eegar/entities/rent.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    customerName: string;

    @Column()
    phone: string;

    @Column()
    identityType: string;

    @Column()
    identityNumber: string;

    @Column()
    identityDocument: string;

    @OneToMany(() => Rent, (rent) => rent.customer)
    rents: Rent[];

    @Column()
    withCustomerId: number;

    @ManyToOne(() => Customer)
    withCustomer: Customer;

    @OneToMany(() => Customer, customer => customer.withCustomer)
    @JoinTable()
    companions: Customer[];

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
