import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HandlebarsService } from './services/handlebars.service';
import { PaginatedDataService } from './services/paginated-data.service';
import { PureSqlService } from './services/pure-sql.service';
import { ConfigModule } from '../config/config.module';

const _exportedServices = [
  PaginatedDataService,
  HandlebarsService,
  PureSqlService,
];

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([]),
  ],
  providers: [
    ..._exportedServices,
  ],
  exports: [
    TypeOrmModule,
    ..._exportedServices,
  ],
})
export class SharedModule { }
