import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from './entities/bill.entity';
import { BillsService } from './services/bills.service';

const exportedServices = [
  BillsService,
];

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([
      Bill,
    ]),
  ],
  providers: [...exportedServices],
  exports: [...exportedServices]
})
export class EegarModule {}
