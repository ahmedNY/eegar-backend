import { AuthService } from "@/accounts/services/auth.service";
import { INestApplication } from "@nestjs/common";
import { CustomSocketAdapter } from "./custom-socket.adapter";
import { RedisPropagatorService } from "./services/redis-propagator.service";
import { SocketStateService } from "./services/socket-state.service";

export const initCustomSocketAdapter = (app: INestApplication): INestApplication => {
    const socketStateService = app.get(SocketStateService);
    const redisPropagatorService = app.get(RedisPropagatorService);
    const authService = app.get(AuthService);

    app.useWebSocketAdapter(new CustomSocketAdapter(
        app,
        socketStateService,
        redisPropagatorService,
        authService,
    ));

    return app;
};
