import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setActiveChat, useChatMessages } from "@/features/chat";
import {
    CreateServerForm,
    setActiveServer,
    useLazyGetServersInsideQuery,
    useLazyGetServersMembersQuery,
} from "@/features/server";
import {  UserProfile } from "@/features/user";
import React, { useEffect, useState } from "react";
import { AppMenu } from "./components/AppMenu";
import { MessageMenu } from "./components/personal/MessagesMenu";
import { MemberChatServer } from "./components/server/MemberChatServer";
import { Action } from "./components/personal/ActionPersonal";
import { ActionServer } from "./components/server/ActionServer";
import { MessageServerMenu } from "./components/server/MessagesServerMenu";
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

    useEffect(() => {
        dispatch(setActiveServer(undefined));
        dispatch(setActiveChat(undefined));
    }, [dispatch]);

    const {} = useChatMessages();

    const hasActiveChat = Boolean(activeChat);
    const hasActiveServer = Boolean(server.activeserver);

    if (hasActiveServer) {
        return (
            <div className="flex h-screen w-screen">
                <AppMenu />
                <MessageServerMenu />

                {hasActiveChat ? (
                    <div className="w-full h-screen">
                        <ActionServer />
                    </div>
                ) : (<div className="w-full"></div>)}
                <CreateServerForm />
                <UserProfile />
                {hasActiveServer && <MemberChatServer />}
            </div>
        );
    }

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
                        <Action />
                    </div>
                ) : (hasActiveServer ? <div className="w-full"></div> : null)}

                {/* {Список друзей} */}
                {!hasActiveChat && !hasActiveServer && <FriendList />}
            </div>
        </div>
    );
};
