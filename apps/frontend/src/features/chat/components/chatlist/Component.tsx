import React from "react";
import { useAppSelector } from "@/app/hooks";
import { Component as ChatItem } from "./chatitem";
import { chat } from "@/features/chat";

export const Component: React.FC<{isServer?: boolean}> = ({isServer}) => {
    const personalChats = useAppSelector((state) => state.user.chats);
    const serverChats = useAppSelector((state) => state.server.activeserver?.chats);
    return (
        <ul className="flex flex-col gap-2 h-full p-3 text-white rounded-[5px]" >
            
            {(!isServer && personalChats) ? personalChats.map((val, index) => (
                <ChatItem key={`${index}-chat-personal-${val.id}`} chat={val} />
            )): null}
           {(serverChats &&
                serverChats.length > 0) ? 
                serverChats.map(
                    (val: chat, index: number) => (
                        <ChatItem
                            key={`${index}-chat-server-${val.id}`}
                            chat={val}
                            isServer={true}
                        />
                    ),
                ): null}
        </ul>
    );
};
