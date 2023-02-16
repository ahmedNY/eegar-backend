import { WebSocketAdapter, INestApplicationContext } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { SocketStateService } from "./services/socket-state.service";
import socketio from 'socket.io';
import { RedisPropagatorService } from "./services/redis-propagator.service";
import { AuthSocket } from "./auth-socket";
import { AuthService } from "@/accounts/services/auth.service";

export class CustomSocketAdapter extends IoAdapter implements WebSocketAdapter {
    constructor(
        app: INestApplicationContext,
        private socketStateService: SocketStateService,
        private redisPropagatorService: RedisPropagatorService,
        private authService: AuthService,
    ) {
        super(app);
    }

    private server: socketio.Server;

    public create(port: number, options: socketio.ServerOptions): socketio.Server {
        this.server = super.createIOServer(port, options);
        this.redisPropagatorService.injectSocketServer(this.server);

        // make sure connected sockets have a valid JWT tokens
        this.server.use(async (socket: AuthSocket, next) => {
            const token = socket.handshake.query?.token as string || socket.handshake.headers?.authorization;

            if (!token) {
                socket.disconnect();
                return;
            }


            try {
                const jwtData = await this.authService.verify(token.replace('Bearer ', ''));
                console.log(jwtData, 'Connected');

                socket.auth = {
                    ...jwtData,
                    userId: jwtData.id,
                };

                return next();
            } catch (e) {
                return next(e);
            }
        });

        return this.server;
    }

    public bindClientConnect(server: socketio.Server, callback: Function): void {
        server.on('connection', (socket: AuthSocket) => {
            if (socket.auth) {
                this.socketStateService.add(socket.auth.userId, socket);

                socket.on('disconnect', () => {
                    this.socketStateService.remove(socket.auth.userId, socket);

                    socket.removeAllListeners('disconnect');
                });
            }

            callback(socket);
        });
    }


}