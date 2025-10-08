import { ioChat } from "@/server";
import { Socket } from "socket.io";

export const chatSocket = (socket: Socket) => {
    console.log("🟢 Новый пользователь:", socket.id);

    // вход в комнату
    socket.on("join-chat", (chatId: string) => {
        socket.join(`chat_${chatId}`);
        console.log(`📥 Пользователь ${socket.id} вошёл в chat_${chatId}`);
    });

    // выход из комнаты
    socket.on("leave-chat", (chatId: string) => {
        socket.leave(`chat_${chatId}`);
        console.log(`📤 Пользователь ${socket.id} покинул chat_${chatId}`);
    });

    // ✏️ начало набора сообщения
    socket.on("typing-start", (chatId: string, username?: string) => {
        console.log(`⌨️ ${username ?? socket.id} печатает в chat_${chatId}`);
        socket.to(`chat_${chatId}`).emit("user-typing-start", {
            chatId,
            username,
            socketId: socket.id,
        });
    });

    // 🛑 конец набора
    socket.on("typing-stop", (chatId: string, username?: string) => {
        console.log(`🛑 ${username ?? socket.id} перестал печатать в chat_${chatId}`);
        socket.to(`chat_${chatId}`).emit("user-typing-stop", {
            chatId,
            username,
            socketId: socket.id,
        });
    });

    // отключение
    socket.on("disconnect", () => {
        console.log(`🔴 Пользователь отключился: ${socket.id}`);
    });
};
