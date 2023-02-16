import { Socket } from "socket.io";

/** Socket with auth object */
export interface AuthSocket extends Socket {
    auth: {
        userId: number;
    };
}