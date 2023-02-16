import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './entities/asset.entity';
import { AssetsService } from './services/assets.service';
import { Rent } from './entities/rent.entity';
import { Extension } from './entities/extension.entity';
import { ExtensionsService } from './services/extensions.service';
import { RentsService } from './services/rents.service';

const exportedServices = [
  AssetsService,
  ExtensionsService,
  RentsService,
];

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([
      Asset,
      Extension,
      Rent,
    ]),
  ],
  providers: [...exportedServices],
  exports: [...exportedServices]
})
export class EegarModule {}
