import { io, Socket } from "socket.io-client";
import { config } from "@/config";

let notificationSocket: Socket | null = null;

export const getNotificationSocket = (token: string): Socket => {
    if (notificationSocket && notificationSocket.connected) {
        return notificationSocket;
    }

    if (!notificationSocket) {
        notificationSocket = io(`${config.monoliteUrl}/notification`, {
            auth: { token },
            transports: ["websocket"],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 2000,
        });
    }

    return notificationSocket;
};
