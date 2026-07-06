import { Socket } from "socket.io-client";

export interface Props {
    socket?: Socket | null;
    notificationConnect: boolean;
    server: any;
}
