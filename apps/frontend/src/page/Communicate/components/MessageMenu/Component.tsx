import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { ChatList, setActiveChat } from "@/features/chat";
import { MenuButton } from "../ui/Button";
import { addAction } from "@/features/action";
import { useNavigate } from "react-router-dom";
import { useServerJournalContext } from "@/contexts/ServerJournalSocketContext";
import { useCreateChatMutation, useLazyGetServersInsideQuery } from "@/features/server";
import { useLazyGetChatsUsersQuery } from "@/features/user";
import { Bolt, Target } from "lucide-react";

export const Component: React.FC = () => {
    const activeServer = useAppSelector(s => s.server.activeserver)
    const dispatch = useAppDispatch();
    const navigator = useNavigate();
    const { socket } = useServerJournalContext();
    const [ trigger ] = useLazyGetServersInsideQuery();
    const [ getPersonalChats ] = useLazyGetChatsUsersQuery();
    const userId = useAppSelector(s => s.auth.user?.info.id);

    const isChat = !activeServer?.id;
    
    const [ menuVisible, setMenuVisible ] = useState(false);
    const [ menuPosition, setMenuPosition ] = useState({ x: 0, y: 0 });
    const [ createText ] = useCreateChatMutation();

    useEffect(() => {
        if (!activeServer) {
            navigator("/app");
        }
    }, [activeServer]);

    useEffect(()=> {
        getPersonalChats(userId);
    }, [userId, ])

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

        e.preventDefault();
        setMenuPosition({ x: e.pageX, y: e.pageY });
        setMenuVisible(true);
    };
        

    return (
        <div className="absolute lg:relative z-20 flex flex-col bg-[rgb(81,110,204)]  lg:bg-[rgba(81,110,204,0.12)] gap-5 justify-between h-full w-full lg:min-w-[250px] lg:max-w-[250px]">
            <div className="flex flex-col gap-0 h-full" onContextMenu={handleContextMenu}>
                {activeServer ? <div className="w-full flex justify-between text-white text-lg bg-[rgb(81,110,204)] p-5 ">
                    <h4 className="truncate">{activeServer.name}</h4>
                    <div className="flex gap-3">
                        <button className="cursor-pointer">
                            <Target />
                        </button>
                        <button className="cursor-pointer">
                            <Bolt  />
                        </button>
                    </div>
                    </div> : 
                
                (<div className="text-5xl lg:text-base flex flex-col gap-5 text-white p-5 ">
                <div className="">
                    <MenuButton handler={()=>{}}>Search</MenuButton>
                </div>
                <div className="">
                    <MenuButton handler={
                        () => {
                            dispatch(setActiveChat(undefined))
                        }
                    }>Friends</MenuButton>
                
                </div>
            </div>)}
            
            <ChatList isServer={!isChat}/>
            {menuVisible && (
                <ul
                    className="absolute bg-[#2550dd] rounded-[10px]"
                    style={{
                        top: menuPosition.y,
                        left: menuPosition.x,
                    }}
                    onContextMenu={(e) => e.preventDefault()} // отключаем контекстное меню внутри
                >
                    <li
                        className="whitespace-nowrap p-2 text-white"
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
                        className="whitespace-nowrap p-2 text-white"
                        onClick={() => handleOptionClick("Опция 3")}
                    >
                        Create invite link
                    </li>
                </ul>
            )}
            </div>
            
        </div>
    );
};
