import { Socket } from "socket.io";

export interface AuthenticatedUser {
    id: string;
    username?: string;
    [key: string]: any;
}

export interface AuthenticatedSocket extends Socket {
    user: AuthenticatedUser;
}

export type SocketNamespace = "chat" | "journal" | "notification";
