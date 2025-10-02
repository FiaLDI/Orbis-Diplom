import { ioChat } from "@/server";
import { AuthenticatedSocket } from "./types/socket";
import { Socket } from "socket.io";

export const chatSocket = (socket: Socket) => {
    console.log("New user chat:", socket.id);

    socket.on("join-chat", async (chatId: string) => {
        console.log(
            `Пользователь ${socket.id} подключился к чату ${chatId}`,
        );
        socket.join(`chat_${chatId}`);
    });

    socket.on("leave-chat", async (chatId: string) => {
        console.log(
            `Пользователь ${socket.id} отключился от чата ${chatId}`,
        );
        socket.leave(`chat_${chatId}`);
    });

    socket.on("send-message", async (chat_id: string) => {
        ioChat.to(`chat_${chat_id}`).emit("new-message");
    });

    socket.on("disconnect", () => {
        console.log("Пользователь отключился");
    });
};
