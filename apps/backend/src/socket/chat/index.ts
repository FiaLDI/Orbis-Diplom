import { Socket, Namespace } from "socket.io";

export const chatSocket = (ioChat: Namespace, socket: Socket) => {
    socket.on("join-chat", (chatId: string) => {
        socket.join(`chat_${chatId}`);
    });

    socket.on("leave-chat", (chatId: string) => {
        socket.leave(`chat_${chatId}`);
    });

    socket.on("typing-start", (chatId: string, username?: string) => {
        socket.to(`chat_${chatId}`).emit("user-typing-start", {
            chatId,
            username,
            socketId: socket.id,
        });
    });

    socket.on("typing-stop", (chatId: string, username?: string) => {
        socket.to(`chat_${chatId}`).emit("user-typing-stop", {
            chatId,
            username,
            socketId: socket.id,
        });
    });

    socket.on("disconnect", () => {});
};
