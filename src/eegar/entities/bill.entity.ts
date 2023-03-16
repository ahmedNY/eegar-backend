import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class Bill {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    url: string;

    @Column()
    billName: string;

    @Column('text')
    billDesc: string;

    @Column({ nullable: true })
    photo?: string;

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn({ nullable: true })
    updatedAt?: Date;

}
