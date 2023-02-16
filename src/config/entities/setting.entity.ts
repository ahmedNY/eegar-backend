import { ApiPropertyInt } from "@/shared/decorators/api-property-int.decorator";;
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Setting {
    @PrimaryGeneratedColumn()
    @ApiPropertyInt({required: true })
    id: number;

    @Column()
    settingName: string;

    @Column()
    settingTitle: string;

    @Column('json')
    settingValue: any;
}
