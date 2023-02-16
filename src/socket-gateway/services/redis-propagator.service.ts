import { Injectable } from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { Server } from 'socket.io';
import { REDIS_SOCKET_EVENT_SEND_NAME, REDIS_SOCKET_EVENT_EMIT_ALL_NAME, REDIS_SOCKET_EVENT_EMIT_AUTHENTICATED_NAME } from '../constants';
import { RedisSocketEventEmitDto } from '../dto/socket-event-emit.dto';
import { RedisSocketEventSendDto } from '../dto/socket-event-send.dto';
import { RedisService } from './redis.service';
import { SocketStateService } from './socket-state.service';

@Injectable()
export class RedisPropagatorService {
    private socketServer: Server;

    constructor(
        private socketStateService: SocketStateService,
        private redisService: RedisService,
    ) {
        this.redisService
            .fromEvent(REDIS_SOCKET_EVENT_SEND_NAME)
            .pipe(tap(this.consumeSendEvent))
            .subscribe();

        this.redisService
            .fromEvent(REDIS_SOCKET_EVENT_EMIT_ALL_NAME)
            .pipe(tap(this.consumeEmitToAllEvent))
            .subscribe();

        this.redisService
            .fromEvent(REDIS_SOCKET_EVENT_EMIT_AUTHENTICATED_NAME)
            .pipe(tap(this.consumeEmitToAuthenticatedEvent))
            .subscribe();
    }

    injectSocketServer(server: Server): RedisPropagatorService {
        this.socketServer = server;

        return this;
    }

    private consumeSendEvent = (eventInfo: RedisSocketEventSendDto): void => {
        const { userId, event, data, socketId } = eventInfo;

        return this.socketStateService
            .get(userId)
            .filter((socket) => socket.id !== socketId)
            .forEach((socket) => {
                return socket.emit(event, JSON.stringify(data));
            });
    };

    private consumeEmitToAllEvent = (
        eventInfo: RedisSocketEventEmitDto,
    ): void => {
        this.socketServer.emit(eventInfo.event, eventInfo.data);
    };

    private consumeEmitToAuthenticatedEvent = (
        eventInfo: RedisSocketEventEmitDto,
    ): void => {
        const { event, data } = eventInfo;

        return this.socketStateService
            .getAll()
            .forEach((socket) => socket.emit(event, data));
    };

    propagateEvent(eventInfo: RedisSocketEventSendDto): boolean {
        if (!eventInfo.userId) {
            return false;
        }

        this.redisService.publish(REDIS_SOCKET_EVENT_SEND_NAME, eventInfo);

        return true;
    }

    emitToAuthenticated(eventInfo: RedisSocketEventEmitDto): boolean {
        this.redisService.publish(
            REDIS_SOCKET_EVENT_EMIT_AUTHENTICATED_NAME,
            eventInfo,
        );

        return true;
    }

    emitToAll(eventInfo: RedisSocketEventEmitDto): boolean {
        this.redisService.publish(REDIS_SOCKET_EVENT_EMIT_ALL_NAME, eventInfo);

        return true;
    }
}
