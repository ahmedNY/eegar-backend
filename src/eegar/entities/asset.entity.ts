import { User } from '@/accounts/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class Asset {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    assetName: string;

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
