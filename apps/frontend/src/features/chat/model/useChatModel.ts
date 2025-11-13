import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useRef } from "react";
import { setActiveChat } from "..";

export function useChatModel() {
    const activeChat = useAppSelector((state) => state.chat.activeChat);
    const topRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();

    const closeChat = () => {
        dispatch(setActiveChat(undefined));
    };

    return {
        closeChat,
        activeChat,
        topRef,
        bottomRef,
    };
}
