import React, { useMemo } from "react";
import { useAppSelector } from "@/app/hooks";
import { Component as ChatItem } from "./chatitem";
import { chat } from "@/features/chat";
import { ChatListProps } from "./inteface";

export const Component: React.FC<ChatListProps> = ({isServer, search}) => {
    const personalChats = useAppSelector((state) => state.user.chats);
    const serverChats = useAppSelector((state) => state.server.activeserver?.chats);

    const normalizedSearch = (search ?? "").toLowerCase();

    const filteredPersonal = useMemo(() => {
        if (!personalChats) return [];
        
        return personalChats.filter((c) =>
        c.name?.toLowerCase().includes(normalizedSearch.toLowerCase()) ||
        c.username?.toLowerCase().includes(normalizedSearch.toLowerCase())
        );
    }, [personalChats, normalizedSearch]);

    const filteredServer = useMemo(() => {
        if (!serverChats) return [];
        return serverChats.filter((c) =>
        c.name?.toLowerCase().includes(normalizedSearch.toLowerCase())
        );
    }, [serverChats, normalizedSearch]);

    return (
        <ul className="flex flex-col gap-2 h-full p-3 text-white rounded-[5px]">
            {!isServer &&
                filteredPersonal.map((val, index) => (
                    <ChatItem key={`${index}-chat-personal-${val.id}`} chat={val} />
                ))}
            {isServer &&
                filteredServer.map((val: chat, index: number) => (
                    <ChatItem key={`${index}-chat-server-${val.id}`} chat={val} isServer />
                ))}
        </ul>
    );
};
