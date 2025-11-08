import { useEffect, useMemo, useState } from "react";
import { useChatSocket } from "./useChatSocket";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { Message, addMessage, setActiveHistory } from "@/features/messages";

export const useChatMessages = () => {
    const [typingUsers, setTypingUsers] = useState<string[]>([]);

    const { socket, isConnected: isSocketConnected } = useChatSocket();
    const dispatch = useAppDispatch();
    const activeChat = useAppSelector((s) => s.chat.activeChat);
    const activeHistory = useAppSelector((s) => s.message.activeHistory);

    // ================================
    // 🔗 Подключение к сокету и join/leave чата
    // ================================
    useEffect(() => {
        if (!socket || !activeChat?.id) return;

        const chatId = activeChat.id;

        if ((socket as any)._joinedChatId === chatId) return;

        socket.emit("join-chat", chatId);
        (socket as any)._joinedChatId = chatId;

        return () => {
            socket.emit("leave-chat", chatId);
            (socket as any)._joinedChatId = null;
        };
    }, [socket, activeChat?.id]);

    // ================================
    // 💬 Реакции на события сокета (новое, редактирование, удаление)
    // ================================
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message: Message) => {
            console.log(message);
            console.log(activeChat?.id);
            console.log(activeChat?.chat_id);
            console.log(activeChat?.id == message.chatId);
            if (message.chatId !== activeChat?.id) return;
            dispatch(addMessage(message));
        };

        const handleEditMessage = (payload: { message_id: string; newContent: string }) => {
            if (!Array.isArray(activeHistory)) return;
            const updated = activeHistory.map((m) =>
                m.id === payload.message_id
                    ? {
                          ...m,
                          is_edited: true,
                          content: m.content.map((c) =>
                              c.type === "text" ? { ...c, text: payload.newContent } : c
                          ),
                      }
                    : m
            );
            dispatch(setActiveHistory(updated));
        };

        const handleDeleteMessage = (payload: { messageId: string }) => {
            if (!Array.isArray(activeHistory)) return;
            const updated = activeHistory.filter((m) => m.id !== payload.messageId);
            dispatch(setActiveHistory(updated));
        };

        socket.on("new-message", handleNewMessage);
        socket.on("edit-message", handleEditMessage);
        socket.on("delete-message", handleDeleteMessage);

        return () => {
            socket.off("new-message", handleNewMessage);
            socket.off("edit-message", handleEditMessage);
            socket.off("delete-message", handleDeleteMessage);
        };
    }, [socket, activeChat?.id, activeHistory, dispatch]);

    // ================================
    // ⌨️ События "печатает"
    // ================================
    useEffect(() => {
        if (!socket || !activeChat?.id) return;

        const handleTypingStart = (data: { chatId: string; username?: string }) => {
            // защита по чатам
            if (data.chatId !== activeChat.id) return;

            // ранний выход, чтобы дальше username точно стал string
            const uname = data.username;
            if (!uname) return;

            setTypingUsers((prev) => {
                // prev: string[]
                if (prev.includes(uname)) return prev;
                return [...prev, uname]; // string[]
            });
        };

        const handleTypingStop = (data: { chatId: string; username?: string }) => {
            if (data.chatId !== activeChat.id) return;

            const uname = data.username;
            if (!uname) return;

            setTypingUsers((prev) => prev.filter((u) => u !== uname));
        };

        socket.on("user-typing-start", handleTypingStart);
        socket.on("user-typing-stop", handleTypingStop);

        return () => {
            socket.off("user-typing-start", handleTypingStart);
            socket.off("user-typing-stop", handleTypingStop);
        };
    }, [socket, activeChat?.id]);

    // ================================
    // 🧩 Группировка сообщений по пользователю и минуте
    // ================================
    const groupedMessages = useMemo(() => {
        if (!Array.isArray(activeHistory) || !activeHistory.length) return [];
        return groupMessagesByMinuteAndUserId(activeHistory);
    }, [activeHistory]);

    return { groupedMessages, isSocketConnected, typingUsers };
};

// ================================
// 🔧 Утилита для группировки сообщений
// ================================
const groupMessagesByMinuteAndUserId = (
    messages: Message[]
): {
    messages: Message[];
    userId: string;
    username: string;
    minute: string;
}[] => {
    const groupedMessages: {
        userId: string;
        messages: Message[];
        username: string;
        minute: string;
    }[] = [];

    let currentGroup: {
        userId: string;
        messages: Message[];
        username: string;
        minute: string;
    } | null = null;

    messages.forEach((message) => {
        const rawTime = message.createdAt ?? "";
        const minuteKey = rawTime.substring(0, 16);

        if (
            !currentGroup ||
            currentGroup.userId !== message.userId ||
            currentGroup.minute !== minuteKey
        ) {
            currentGroup = {
                userId: message.userId,
                messages: [],
                minute: minuteKey,
                username: message.username,
            };
            groupedMessages.push(currentGroup);
        }
        currentGroup.messages.push(message);
    });

    return groupedMessages;
};
