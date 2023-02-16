import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from './entities/setting.entity';
import { AppInfoService } from './services/app-info.service';
import { SettingsService } from './services/settings.service';

const _exportedServices = [
  AppInfoService,
  SettingsService,
];
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Setting,
    ]),
  ],
  providers: [..._exportedServices],
  exports: [TypeOrmModule, ..._exportedServices],
})
export class ConfigModule { }
