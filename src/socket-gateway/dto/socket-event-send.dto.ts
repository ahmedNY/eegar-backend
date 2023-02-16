import { RedisSocketEventEmitDto } from './socket-event-emit.dto';

export class RedisSocketEventSendDto extends RedisSocketEventEmitDto {
  userId: number;
  socketId?: string;
}
