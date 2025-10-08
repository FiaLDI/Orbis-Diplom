import React from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { chat, setActiveChat } from "@/features/chat";
import { setActivePersonalCommunicate } from "@/features/action";

export const Component: React.FC<{ chat: chat; isServer?: boolean }> = ({ chat, isServer }) => {
    const activeChat = useAppSelector((state) => state.chat.activeChat);
    const dispatch = useAppDispatch();

    return (
        <>
            <li
                className=" cursor-pointer hover:brightness-90 select-none"
                onClick={() => {
                    dispatch(setActiveChat(chat));
                    dispatch(
                        setActivePersonalCommunicate(
                            window.innerWidth > 1024 || false,
                        ),
                    );
                }}
            >
                <div
                    className={
                        activeChat?.id == chat.id
                            ? "flex bg-[#ffffff3a] gap-3 items-center p-2 rounded-[5px]"
                            : "flex gap-3 items-center p-2"
                    }
                >
                    {!isServer ? <div className="w-fit">
                        <img
                            src={chat.avatar_url || '/img/icon.png'}
                            alt=""
                            className="w-20 h-20 lg:w-7 lg:h-7"
                        />
                    </div>: null}
                    
                    <div className="text-3xl lg:text-base truncate w-full shrink-10 lg:max-w-50">
                        {chat.name}
                    </div>
                </div>
            </li>
        </>
    );
};
