import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { SingleMessage } from "./SingleMessage";
import {
    leaveEditMode,
    setEditMode,
    setOpenMessage,
    setReply,
} from "../chatSlice";
import {
    useLazyGetMessagesQuery,
    useRemoveMessageMutation,
} from "../api/chatApi";

const HistoryChat: React.FC<{
    bottomRef: React.RefObject<HTMLDivElement>;
    topRef: React.RefObject<HTMLDivElement>;
}> = ({ bottomRef, topRef }) => {
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const offsetRef = useRef(0); // актуальное значение offset для колбеков
    const fetchingRef = useRef(false); // блокировка запросов
    const history = useAppSelector((s) => s.chat.activeHistory);
    const activeChat = useAppSelector((s) => s.chat.activeChat);
    const [getMessages] = useLazyGetMessagesQuery();
    const menuRef = useRef<HTMLUListElement>(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector((s) => s.chat.openMessage);
    const [removeMessage] = useRemoveMessageMutation();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                setMenuVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMessageClick = (e: React.MouseEvent, message: any) => {
        e.preventDefault();
        e.stopPropagation();
        setMenuPosition({ x: e.pageX, y: e.pageY });
        setMenuVisible(true);
        dispatch(setOpenMessage(message));
    };

    useEffect(() => {
        if (!activeChat) return;
        setHasMore(true);
        offsetRef.current = 0;
        setOffset(0);
        console.log(activeChat.chat_id)
        getMessages({ id: activeChat.chat_id, offset: 0 }).catch(() => {});
    }, [activeChat, getMessages]);

    useEffect(() => {
        if (!history?.length || offset !== 0) return;
        setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: "auto" });
        }, 0);
    }, [history, offset, bottomRef]);

    useEffect(() => {
        const topEl = topRef?.current;
        const rootEl = containerRef.current;
        if (!topEl || !rootEl || !activeChat || !hasMore) return; // если нет больше данных — не запускаем

        const observer = new IntersectionObserver(
            async (entries) => {
                const ent = entries[0];
                if (!ent || !ent.isIntersecting) return;
                if (fetchingRef.current) return;

                const prevScrollHeight = rootEl.scrollHeight;
                const prevScrollTop = rootEl.scrollTop;

                const newOffset = offsetRef.current + 1;
                offsetRef.current = newOffset;
                setOffset(newOffset);

                fetchingRef.current = true;
                try {
                    const data = await getMessages({
                        id: activeChat.chat_id,
                        offset: newOffset,
                    });

                    if (!data?.data?.length) {
                        setHasMore(false);
                    }

                    setTimeout(() => {
                        const newScrollHeight = rootEl.scrollHeight;
                        const added = newScrollHeight - prevScrollHeight;
                        rootEl.scrollTop = prevScrollTop + added;
                        fetchingRef.current = false;
                    }, 50);
                } catch {
                    offsetRef.current = Math.max(0, offsetRef.current - 1);
                    setOffset(offsetRef.current);
                    fetchingRef.current = false;
                }
            },
            {
                root: rootEl,
                threshold: 0.1,
                rootMargin: "50px",
            },
        );

        observer.observe(topEl);
        return () => observer.disconnect();
    }, [activeChat, getMessages, hasMore]);

    if (!history) return null;

    const handleOptionClick = (option: string) => {
        console.log(`[${history[0]?.username}] Вы выбрали: ${option}`);
        setMenuVisible(false);
        dispatch(setOpenMessage(undefined));
    };

    const handleReplyMessage = () => {
        dispatch(setReply(String(isOpen?.id)));
        dispatch(setOpenMessage(undefined));
        setMenuVisible(false);
    };

    const handleEditMessage = () => {
        if (!isOpen) return;
        if (!isOpen.id && !isOpen.chat_id) return;
        dispatch(
            setEditMode({
                enabled: true,
                messagesId: String(isOpen?.id),
                chatId: String(isOpen?.chat_id),
            }),
        );
        setMenuVisible(false);
    };

    const handleRemoveMessage = () => {
        const confirms = confirm("Вы уверены? ");
        if (confirms && isOpen) {
            removeMessage({ chat_id: isOpen.chat_id, id: isOpen.id });
        }
        setMenuVisible(false);
    };

    const handleCopyMessage = () => {
        if (!isOpen) return;
        navigator.clipboard.writeText(isOpen.content?.[0]?.text ?? "");
        setMenuVisible(false);
    };

    return (
        <div
            ref={containerRef}
            className="overflow-y-auto bg-[#25309b88] p-4 h-[calc(100vh_-_370px)] lg:h-screen text-white flex flex-col gap-3"
        >
            <div ref={topRef} />
            {history.map((message: any, idx: number) => (
                <SingleMessage
                    key={`single-${message.chat_id}-${idx}`}
                    message={message}
                    onClick={(e) => handleMessageClick(e, message)}
                />
            ))}
            <div ref={bottomRef} />
            {menuVisible && (
                <ul
                    ref={menuRef}
                    className="p-5 flex gap-3 flex-col bg-[#25309b88]"
                    style={{
                        position: "fixed",
                        top: `${menuPosition.y}px`,
                        left: `${menuPosition.x}px`,
                        zIndex: 9999,
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    <li onClick={handleReplyMessage}>Reply</li>
                    <li onClick={handleEditMessage}>Edit</li>
                    <li onClick={() => handleOptionClick("Pin")}>Pin</li>
                    <li onClick={handleCopyMessage}>Copy text</li>
                    <li onClick={handleRemoveMessage}>Delete</li>
                </ul>
            )}
        </div>
    );
};

export default HistoryChat;
