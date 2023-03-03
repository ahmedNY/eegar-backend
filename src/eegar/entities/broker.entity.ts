import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Broker {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    brokerName: string;

    @Column()
    phone: string;

    @Column()
    address: string;

    @Column()
    office: string;

    @Column()
    commission: number;

    @CreateDateColumn()
    createdAt: Date;
}
