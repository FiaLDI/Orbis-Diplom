import { ioJournal } from "@/server";
import dotenv from "dotenv";
import { redisClient } from "@/config";
import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
dotenv.config();

export const journalSocket = (socket: Socket) => {
    console.log("New user journal:", socket.id);

    try {
        const token = socket.handshake.auth?.token;
        const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
        if (decoded?.id) {
        socket.join(`user:${decoded.id}`);
        socket.data.userId = decoded.id;
        console.log(`Socket joined user room: user:${decoded.id}`);
        }
    } catch (err) {
        console.warn("Invalid or missing token for journal socket");
    }

    socket.on("set-status", (userId, status) => {
        redisClient.set(`user:${userId}:${status}`, "true");
        socket.broadcast.emit("user-online", userId);
    });

    socket.on('join-server', (serverId) => {
        console.log(`${serverId} join ${socket.id}`);
        socket.join(`server:${serverId}`);
    });

    socket.on("leave-server", (serverId) => {
        console.log(`${serverId} leave ${socket.id}`);
        socket.leave(`server:${serverId}`);
    });

    socket.on("update-into-server", (signal, serverId) => {
        if (signal == "update-server-active") {
            ioJournal.to(`server:${serverId}`).emit("update-into-server");
            console.log(`Обновление для участников сервера ${serverId}`);
        }
    });

    socket.on("disconnect", () => {
        //redisClient.del(`user:${socket.userId}:${socket.status}`);
        //socket.broadcast.emit('user-offline', socket.userId);
    });
};
