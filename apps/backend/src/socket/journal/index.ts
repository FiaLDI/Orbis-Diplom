import jwt from "jsonwebtoken";
import { Socket, Namespace } from "socket.io";
import { redisClient } from "@/config";

export const journalSocket = (ioJournal: Namespace, socket: Socket) => {
    try {
        const token = socket.handshake.auth?.token;
        const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
        if (decoded?.id) {
            socket.join(`user:${decoded.id}`);
            socket.data.userId = decoded.id;
        }
    } catch {}

    socket.on("set-status", (userId: number, status: string) => {
        redisClient.set(`user:${userId}:${status}`, "true");
        socket.broadcast.emit("user-online", userId);
    });

    socket.on("join-server", (serverId: number) => {
        socket.join(`server:${serverId}`);
    });

    socket.on("leave-server", (serverId: number) => {
        socket.leave(`server:${serverId}`);
    });

    socket.on("update-into-server", (signal: string, serverId: number) => {
        if (signal === "update-server-active") {
            ioJournal.to(`server:${serverId}`).emit("update-into-server");
        }
    });

    socket.on("disconnect", () => {});
};
