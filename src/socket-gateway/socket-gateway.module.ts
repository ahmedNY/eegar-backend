import { AccountsModule } from '@/accounts/accounts.module';
import { REDIS_SUBSCRIBER_CLIENT, REDIS_PUBLISHER_CLIENT } from '@/socket-gateway/constants';
import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { SocketListener } from './listeners/socket.listener';
import { RedisPropagatorService } from './services/redis-propagator.service';
import { RedisService } from './services/redis.service';
import { SocketStateService } from './services/socket-state.service';
import { SocketGateway } from './socket.gateway';

function _getRedisProvider(provide: string): Provider<any> {
    return {
        provide,
        inject: [ConfigService],
        useFactory: (configService: ConfigService): Redis => {
            return new Redis({
                host: configService.get('REDIS_HOST'),
                port: configService.get('REDIS_PORT'),
            });
        },
    }
}

@Module({
    imports: [
        AccountsModule,
        ConfigModule,
    ],
    providers: [
        _getRedisProvider(REDIS_SUBSCRIBER_CLIENT),
        _getRedisProvider(REDIS_PUBLISHER_CLIENT),
        RedisService,
        SocketStateService,
        RedisPropagatorService,
        SocketGateway,
        SocketListener,
    ],
    exports: [
        RedisPropagatorService,
    ],
})
export class SocketGatewayModule { }

