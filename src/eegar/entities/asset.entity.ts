import { User } from '@/accounts/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Rent } from './rent.entity';

@Entity()
export class Asset {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    assetName: string;

    @Column()
    buildingNumber: string;

    @Column()
    blockNumber: string;

    @Column()
    district: string;

    @Column({ nullable: true })
    floor?: string;

    @Column({ nullable: true })
    bedsCount?: number;

    @Column({ nullable: true })
    bathroomsCount?: number;

    @Column({ nullable: true })
    photo?: string;

    @Column('double')
    price?: number;

    @OneToMany(() => Rent, rent => rent.asset)
    rents?: Rent[];

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
