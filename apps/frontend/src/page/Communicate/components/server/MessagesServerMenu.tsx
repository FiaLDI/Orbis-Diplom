import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { chat, setActiveChat } from "@/features/chat";
import { useGetChatsUsersQuery } from "@/features/user";
import { ServerItem } from "./ServerItem";
import { useNavigate } from "react-router-dom";
import {
    useCreateChatMutation,
    useLazyGetServersInsideQuery,
} from "@/features/server";
import { useServerJournalContext } from "@/contexts/ServerJournalSocketContext";
import { addAction } from "@/features/action";

export const MessageServerMenu: React.FC = () => {
    const activeServer = useAppSelector((state) => state.server.activeserver);
    const dispatch = useAppDispatch();
    const {} = useGetChatsUsersQuery({});
    const navigator = useNavigate();
    const authInfo = useAppSelector((s) => s.auth.user?.info);

    const { socket } = useServerJournalContext();
    const [trigger] = useLazyGetServersInsideQuery();
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [createText, { isSuccess: succText }] = useCreateChatMutation();

    if (!activeServer) {
        navigator("/app");
    }

    useEffect(() => {
        if (!socket) return;
        if (!activeServer?.id) return;

        const updateServer = () => {
            trigger(activeServer?.id);

            dispatch(
                addAction({
                    id: Date.now(),
                    type: "SUCCESS",
                    text: "Success updated",
                    duration: 3000,
                }),
            );
        };

        socket.on("update-into-server", updateServer);
        return () => {
            socket.off("update-into-server", updateServer);
        };
    }, [socket, activeServer?.id]);

    const handleOptionClick = (option: string) => {
        console.log(`Вы выбрали: ${option}`);
        setMenuVisible(false); // Скрыть меню после клика
    };

    const handleContextMenu = (e: React.MouseEvent<HTMLElement>) => {
        if (e.target !== e.currentTarget) return; // Игнорируем дочерние элементы

        e.preventDefault();
        setMenuPosition({ x: e.pageX, y: e.pageY });
        setMenuVisible(true);
    };

    return (
        <>
            {activeServer && (
                <div className="flex flex-col bg-[rgba(81,110,204,0.12)] p-5 gap-5 justify-between h-full min-w-[250px] max-w-[250px]">
                    <h2 className="text-white text-2xl">
                        {activeServer?.name}
                    </h2>
                    <div className="flex flex-col gap-5 h-full">
                        <ul
                            className="flex flex-col gap-2 h-full  text-white"
                            onContextMenu={handleContextMenu}
                        >
                            {activeServer.chats &&
                                activeServer.chats.length > 0 &&
                                activeServer.chats.map(
                                    (val: chat, index: number) => (
                                        <ServerItem
                                            key={`${index}-chat-server-${val.id}`}
                                            chat={val}
                                        />
                                    ),
                                )}
                        </ul>
                    </div>
                    {menuVisible && (
                        <ul
                            className="absolute bg-[#2550dd] "
                            style={{
                                top: menuPosition.y,
                                left: menuPosition.x,
                            }}
                            onContextMenu={(e) => e.preventDefault()} // отключаем контекстное меню внутри
                        >
                            <li
                                className="p-2"
                                onClick={() => {
                                    if (!socket) return;
                                    createText({ id: activeServer?.id });
                                    socket.emit(
                                        "update-into-server",
                                        "update-server-active",
                                        activeServer?.id,
                                    );
                                }}
                            >
                                Create text chat
                            </li>
                            <li
                                className="p-2"
                                onClick={() => handleOptionClick("Опция 3")}
                            >
                                Invite
                            </li>
                        </ul>
                    )}
                </div>
            )}
        </>
    );
};
