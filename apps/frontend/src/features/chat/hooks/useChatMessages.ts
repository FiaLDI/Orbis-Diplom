import { useEffect, useMemo, useState } from "react";
import { useChatSocket } from "./useChatSocket";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import {
  Message,
  clearActiveHistory,
  setActiveHistory,
  addMessage,
  useLazyGetMessagesQuery
} from "@/features/messages";


export const useChatMessages = () => {
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const { socket } = useChatSocket();
  const dispatch = useAppDispatch();
  const activeChat = useAppSelector((s) => s.chat.activeChat);
  const activeHistory = useAppSelector((s) => s.message.activeHistory);
  const [getMessages] = useLazyGetMessagesQuery();

  /** 🔌 Подключение к сокету и join/leave комнаты **/
  useEffect(() => {
    if (!socket || !activeChat?.id) return;

    const chatId = activeChat.id;
    console.log("📡 join-chat", chatId);
    socket.emit("join-chat", chatId);

    return () => {
      console.log("🚪 leave-chat", chatId);
      socket.emit("leave-chat", chatId);
    };
  }, [socket, activeChat?.id]);

  /** 🧾 Первичная загрузка сообщений **/
  useEffect(() => {
    if (!activeChat?.id) return;

    dispatch(clearActiveHistory());
    getMessages({ id: activeChat.id, offset: 0 })
      .unwrap()
      .then((data) => {
        dispatch(setActiveHistory(data));
      })
      .catch((err) => console.error("Ошибка загрузки истории:", err));
  }, [activeChat?.id]);

  /** 🔁 Подписка на события от сокета **/
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
        if (message.chat_id !== activeChat?.id) return;
        dispatch(addMessage(message));
        };


    const handleEditMessage = (payload: { message_id: number; newContent: string }) => {
      if (!activeHistory) return;
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

    const handleDeleteMessage = (payload: { message_id: number }) => {
      if (!activeHistory) return;
      const updated = activeHistory.filter((m) => m.id !== payload.message_id);
      dispatch(setActiveHistory(updated));
    };

    const handleConnect = () => setIsSocketConnected(true);
    const handleDisconnect = () => setIsSocketConnected(false);

    socket.off("new-message");
    socket.on("new-message", handleNewMessage);
    socket.on("edit-message", handleEditMessage);
    socket.on("delete-message", handleDeleteMessage);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("edit-message", handleEditMessage);
      socket.off("delete-message", handleDeleteMessage);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [socket, activeChat?.id]);

  /** ⌨️ Индикатор "печатает..." **/
  useEffect(() => {
    if (!socket || !activeChat?.id) return;

    const handleTypingStart = (data: { chatId: number; username?: string }) => {
      if (data.chatId !== activeChat.id || !data.username) return;

      setTypingUsers((prev) => {
        if (prev.includes(data.username!)) return prev;
        return [...prev, data.username!];
      });
    };

    const handleTypingStop = (data: { chatId: number; username?: string }) => {
      if (data.chatId !== activeChat.id || !data.username) return;

      setTypingUsers((prev) => prev.filter((u) => u !== data.username));
    };

    socket.on("user-typing-start", handleTypingStart);
    socket.on("user-typing-stop", handleTypingStop);

    return () => {
      socket.off("user-typing-start", handleTypingStart);
      socket.off("user-typing-stop", handleTypingStop);
    };
  }, [socket, activeChat?.id]);

  /** 🧠 Опционально: группировка сообщений для UI **/
  const groupedMessages = useMemo(() => {
    if (!activeHistory?.length) return [];
    return groupMessagesByMinuteAndUserId(activeHistory);
  }, [activeHistory]);

  return { groupedMessages, isSocketConnected, typingUsers };
};

/** 🔧 Группировка сообщений по пользователю и минуте **/
const groupMessagesByMinuteAndUserId = (
  messages: Message[]
): {
  messages: Message[];
  user_id: number;
  username: string;
  minute: string;
}[] => {
  const groupedMessages: {
    user_id: number;
    messages: Message[];
    username: string;
    minute: string;
  }[] = [];

  let currentGroup: {
    user_id: number;
    messages: Message[];
    username: string;
    minute: string;
  } | null = null;

  messages.forEach((message) => {
    const minuteKey = message.timestamp.substring(0, 5);
    if (
      !currentGroup ||
      currentGroup.user_id !== message.user_id ||
      currentGroup.minute !== minuteKey
    ) {
      currentGroup = {
        user_id: message.user_id,
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
