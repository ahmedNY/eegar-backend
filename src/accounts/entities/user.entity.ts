import { ApiPropertyInt } from "@/shared/decorators/api-property-int.decorator";;
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    @ApiPropertyInt({ required: true })
    id: number;

    @Column({ nullable: true })
    fullName?: string;

    @Column({ nullable: true })
    email?: string;

    @Column()
    phoneNumber: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    @ApiPropertyInt({ required: false })
    gender?: boolean;

    @Column({ nullable: true })
    firebaseToken?: string;

    @Column({ default: false })
    isAdmin: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ default: 'profile.jpg' })
    fileName?: string;

    @UpdateDateColumn()
    updatedAt?: Date;

}
