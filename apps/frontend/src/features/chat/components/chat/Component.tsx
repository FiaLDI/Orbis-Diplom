import React, { useRef } from "react";
import { useAppSelector } from "@/app/hooks";
import { HistoryChatComponent, InputChatComponent } from "@/features/messages";

export const Component: React.FC = () => {
    const activeChat = useAppSelector(state => state.chat.activeChat);
    const topRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

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
                <div className="flex gap-5 bg-[#2e3ed328] pr-10 lg:pr-5 pl-10 lg:pl-5 p-5 lg:p-2 w-full lg:w-auto justify-end">
                <div className="w-full lg:w-auto 
                ">
                    <input type="text" className="w-full lg:w-auto text-5xl lg:text-base rounded-[5px] bg-[#2e3ed328] pl-1" placeholder="Search" />
                </div>
                
                </div>
            </div>

            <HistoryChatComponent bottomRef={bottomRef} topRef={topRef} />

            <InputChatComponent 
            
           // scrollToBottom={scrollToBottom} 
            />
        </div>
    );
};
