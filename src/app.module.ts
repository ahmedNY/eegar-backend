import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigModule as NestConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import type { ClientOpts } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { AccountsModule } from './accounts/accounts.module';
import { GatewayModule } from './gateway/gateway.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SharedModule } from './shared/shared.module';
import { SocketGatewayModule } from './socket-gateway/socket-gateway.module';
import { EegarModule } from './eegar/eegar.module';

export async function getTypeOrmModule() {
  await NestConfigModule.envVariablesLoaded;
  return TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: +process.env.MYSQL_PORT,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    synchronize: true,
    autoLoadEntities: true,
    logging: true,
    cache: {
      type: 'ioredis',
      duration: 1000 * 60,
      options: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
    },
  });
}

@Module({
  imports: [
    CacheModule.register<ClientOpts>({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    getTypeOrmModule(),
    GatewayModule,
    ConfigModule,
    AccountsModule,
    NotificationsModule,
    SharedModule,
    SocketGatewayModule,
    EegarModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
