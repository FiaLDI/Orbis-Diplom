import jwt from "jsonwebtoken";
import { ExtendedError } from "socket.io/dist/namespace";
import { Socket } from "socket.io";
import { AuthenticatedSocket } from "../types";

export const authenticateSocket = (socket: Socket, next: (err?: ExtendedError) => void) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
        return next(new Error("Unauthorized"));
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;

        (socket as AuthenticatedSocket).user = {
            id: decoded.id,
            username: decoded.username,
            ...decoded,
        };

        next();
    } catch (err) {
        next(new Error("Unauthorized"));
    }
};
