import React, { useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { HistoryChatComponent, InputChatComponent } from "@/features/messages";
import { X } from "lucide-react";
import { setActiveChat } from "../..";

export const Component: React.FC = () => {
    const activeChat = useAppSelector(state => state.chat.activeChat);
    const topRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    if (!activeChat) {
        return null;
    }

    return (
        <div className="flex flex-col h-full p-5 rounded-[5px] lg:h-screen  ">
            <div className="flex bg-[#2e3ed328] text-white text-1xl justify-between items-center flex-wrap shrink-0">
                <div className="text-5xl lg:text-base pl-5 p-2">
                    {activeChat.name}
                </div>
                
                <div className="w-full lg:w-auto 
                ">
                    <button className="cursor-pointer pl-5 p-2" onClick={()=> dispatch(setActiveChat(undefined))}><X /></button>
                </div>
            </div>

            <HistoryChatComponent bottomRef={bottomRef} topRef={topRef} />

            <InputChatComponent 
            
           // scrollToBottom={scrollToBottom} 
            />
        </div>
    );
};
