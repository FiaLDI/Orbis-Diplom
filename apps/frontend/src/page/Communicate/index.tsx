import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { ChatComponent, setActiveChat, useChatMessages } from "@/features/chat";
import {
    CreateServerForm,
    MemberServer,
    setActiveServer,
    useLazyGetServersInsideQuery,
    useLazyGetServersMembersQuery,
} from "@/features/server";
import {  UserProfile } from "@/features/user";
import React, { useEffect, useState } from "react";
import { AppMenu } from "./components/AppMenu";
import { Component as MessageMenu } from "./components/MessageMenu";
import { FriendList, SearchFriends } from "@/features/friends";

export const CommunicatePage: React.FC = () => {
    const dispatch = useAppDispatch();

    const server = useAppSelector((state) => state.server);
    const activeChat = useAppSelector((state) => state.chat.activeChat);
    const [trigger] = useLazyGetServersMembersQuery();
    const [getServer] = useLazyGetServersInsideQuery();
    const [isMessageMenuOpen, setIsMessageMenuOpen] = useState(true);

    const activeServerId = server.activeserver?.id;

    useEffect(() => {
        if (activeServerId) {
            trigger(activeServerId);
            getServer(activeServerId);
            dispatch(setActiveChat(undefined));
        }
    }, [activeServerId]);

    const hasActiveChat = Boolean(activeChat);
    const hasActiveServer = Boolean(server.activeserver);

    return (
        <div className="flex flex-col lg:flex-row h-screen w-screen">
            {/* {Меню приложения} */}
            <AppMenu />

            {/* {Профиль пользователей} */}
            <UserProfile />

            {/* {Добавление сервера} */}
            <CreateServerForm />

            {/* {Поиск друзей} */}
            <SearchFriends />
            <div className="w-full flex h-full relative">
                {/* {чаты пользователя} */}
                {isMessageMenuOpen ? <MessageMenu /> : null}

                {/* {Чат} */}
                {hasActiveChat ? (
                    <div className="w-full h-full lg:h-screen">
                        <ChatComponent />
                    </div>
                ) : (hasActiveServer ? <div className="w-full"></div> : null)}

                {/* {Участники сервера} */}
                <MemberServer />

                {/* {Список друзей} */}
                {!hasActiveChat && !hasActiveServer && <FriendList />}
            </div>
        </div>
    );
};
