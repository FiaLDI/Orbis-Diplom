import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useMemo } from "react";
import { chat, setActiveChat } from "..";
import { useTranslation } from "react-i18next";

export function useChatListModel(search: string = "") {
  const { t } = useTranslation("chat");
  const activeChat = useAppSelector((state) => state.chat.activeChat);
  const personalChats = useAppSelector((state) => state.user.chats);
  const serverChats = useAppSelector(
    (state) => state.server.activeserver?.chats,
  );

  const normalizedSearch = search.toLowerCase();

  const filteredPersonal = useMemo(() => {
    if (!personalChats) return [];

    return personalChats.filter((c) => {
      const matchTitle = c.title?.toLowerCase().includes(normalizedSearch);
      const matchMember = c.members?.some((m: any) =>
        m.username?.toLowerCase().includes(normalizedSearch),
      );

      return matchTitle || matchMember;
    });
  }, [personalChats, normalizedSearch]);

  const filteredServer = useMemo(() => {
    if (!serverChats) return [];
    return serverChats.filter((c) =>
      c.name?.toLowerCase().includes(normalizedSearch.toLowerCase()),
    );
  }, [serverChats, normalizedSearch]);
  const dispatch = useAppDispatch();

  const openChat = (chat: chat) => {
    dispatch(setActiveChat(chat));
  };

  return {
    t,
    openChat,
    activeChat,
    filteredPersonal,
    filteredServer,
  };
}
