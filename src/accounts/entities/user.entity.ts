import { Video } from "@/gebril_videos/entities/video.entity";
import { ApiPropertyInt } from "@/shared/decorators/api-property-int.decorator";;
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, JoinColumn } from 'typeorm';

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

    @Column({ nullable: true })
    fileName?: string;

    @UpdateDateColumn()
    updatedAt?: Date;

    @ManyToMany(() => Video, video => video.usersLiked)
    @JoinTable()
    likedVideos: Video[]
}
