import { Server, } from "socket.io";
import { UseInterceptors } from "@nestjs/common";
import { RedisPropagatorInterceptor } from "./redis-propagator.interceptor";
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

@WebSocketGateway()
// @UseInterceptors(RedisPropagatorInterceptor)
export class SocketGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('events')
    onEvent(client: any, data: any) {
        return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
    }

    @SubscribeMessage('message')
    handleMessage(@MessageBody() message: { data: string }): void {
        console.log(message);
        message.data = 'SGW: ' + message.data;
        this.server.emit('message', message);
    }
}