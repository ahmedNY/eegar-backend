import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './entities/asset.entity';
import { AssetsService } from './services/assets.service';
import { Rent } from './entities/rent.entity';
import { Extension } from './entities/extension.entity';
import { ExtensionsService } from './services/extensions.service';
import { RentsService } from './services/rents.service';
import { PaymentsService } from './services/payments.service';
import { Payment } from './entities/payment.entity';
import { RentStateTrans } from './entities/rent-state.entity';
import { RentStateTransService } from './services/rents-state-trans.service';
import { BrokersService } from './services/brokers.service';
import { Broker } from './entities/broker.entity';

const exportedServices = [
  AssetsService,
  BrokersService,
  ExtensionsService,
  PaymentsService,
  RentsService,
  RentStateTransService,
];

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([
      Asset,
      Broker,
      Extension,
      Payment,
      Rent,
      RentStateTrans,
    ]),
  ],
  providers: [...exportedServices],
  exports: [...exportedServices]
})
export class EegarModule {}
