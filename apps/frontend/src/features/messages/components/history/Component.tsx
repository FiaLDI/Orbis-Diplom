import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Component as SingleMessage } from "./messages";
import { setEditMode, setReply, clearActiveHistory, setActiveHistory } from "@/features/messages";
import { useLazyGetMessagesQuery, useRemoveMessageMutation } from "@/features/messages";
import { useChatMessages } from "@/features/chat";
import { useContextMenu } from "@/features/shared";
import { AnimatedContextMenu } from "@/features/shared/components/AnimatedContextMenu";
import { Reply, Pencil, Copy, Trash2 } from "lucide-react";
import { Props } from "./interface";
import { useTranslation } from "react-i18next";

export const Component: React.FC<Props> = ({ bottomRef, topRef }) => {
    useChatMessages();

    const dispatch = useAppDispatch();
    const activeChat = useAppSelector((s) => s.chat.activeChat);
    const activeHistory = useAppSelector((s) => s.message.activeHistory);
    const allHistories = useAppSelector((s) => s.message.histories);
    const currentUser = useAppSelector((s) => s.auth.user?.info);

    const [getMessages] = useLazyGetMessagesQuery();
    const [removeMessage] = useRemoveMessageMutation();

    const { t } = useTranslation("messages");

    const containerRef = useRef<HTMLDivElement>(null);
    const offsetRef = useRef(0);
    const fetchingRef = useRef(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);

    const { contextMenu, handleContextMenu, closeMenu, menuRef } = useContextMenu<
        any,
        HTMLUListElement
    >();

    const prevChatId = useRef<number | undefined>();

    useEffect(() => {
    if (activeChat?.id === prevChatId.current) return;

    prevChatId.current = activeChat?.id;

    if (!activeChat?.id) {
        dispatch(clearActiveHistory());
        return;
    }

    if (allHistories[activeChat.id]?.length) {
        dispatch(setActiveHistory(allHistories[activeChat.id]));
    } else {
        setHasMore(true);
        offsetRef.current = 0;
        setOffset(0);
        getMessages({ id: activeChat.id, offset: 0 }).catch(() => {});
    }
}, [activeChat?.id]);

    useEffect(() => {
        if (!activeHistory?.length || offset !== 0) return;
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "auto" }), 0);
    }, [activeHistory, offset, bottomRef]);

    useEffect(() => {
        const topEl = topRef?.current;
        const rootEl = containerRef.current;
        if (!topEl || !rootEl || !activeChat?.id || !hasMore) return;

        const observer = new IntersectionObserver(
            async (entries) => {
                const ent = entries[0];
                if (!ent?.isIntersecting || fetchingRef.current) return;

                const prevScrollHeight = rootEl.scrollHeight;
                const prevScrollTop = rootEl.scrollTop;

                const newOffset = offsetRef.current + 1;
                offsetRef.current = newOffset;
                setOffset(newOffset);

                fetchingRef.current = true;
                try {
                    const data = await getMessages({ id: activeChat.id, offset: newOffset });
                    if (!data?.data?.length) setHasMore(false);

                    setTimeout(() => {
                        const newScrollHeight = rootEl.scrollHeight;
                        const added = newScrollHeight - prevScrollHeight;
                        rootEl.scrollTop = prevScrollTop + added;
                        fetchingRef.current = false;
                    }, 50);
                } catch {
                    offsetRef.current = Math.max(0, offsetRef.current - 1);
                    fetchingRef.current = false;
                }
            },
            { root: rootEl, threshold: 0.1, rootMargin: "50px" }
        );

        observer.observe(topEl);
        return () => observer.disconnect();
    }, [activeChat?.id, getMessages, hasMore]);

    const handleReplyMessage = () => {
        if (!contextMenu?.data) return;
        dispatch(setReply(String(contextMenu.data.id)));
        closeMenu();
    };

    const handleEditMessage = () => {
        const msg = contextMenu?.data;
        if (!msg?.id || !msg.chatId) return;
        dispatch(
            setEditMode({
                enabled: true,
                messagesId: String(msg.id),
                chatId: String(msg.chatId),
            })
        );
        closeMenu();
    };

    const handleRemoveMessage = () => {
        const msg = contextMenu?.data;
        if (msg && confirm("Удалить сообщение?")) {
            removeMessage({ chat_id: msg.chat_id, id: msg.id });
        }
        closeMenu();
    };

    const handleCopyMessage = () => {
        const msg = contextMenu?.data;
        if (msg) navigator.clipboard.writeText(msg.content?.[0]?.text ?? "");
        closeMenu();
    };

    const menuItems = [
        { label: t("action.reply"), action: handleReplyMessage, icon: <Reply size={15} /> },
        { label: t("action.edit"), action: handleEditMessage, icon: <Pencil size={15} /> },
        { label: t("action.copy"), action: handleCopyMessage, icon: <Copy size={15} /> },
        {
            label: t("action.delete"),
            action: handleRemoveMessage,
            icon: <Trash2 size={15} />,
            danger: true,
        },
    ];

    return (
        <div
            ref={containerRef}
            className="overflow-y-auto bg-background/50 p-4 h-[calc(100vh_-_370px)] lg:h-screen text-white flex flex-col gap-3"
        >
            <div ref={topRef} />
            {Array.isArray(activeHistory) && activeHistory?.map((message, idx) => (
                <SingleMessage
                    key={`single-${message.chatId}-${idx}`}
                    message={message}
                    onClick={(e) => handleContextMenu(e, message)}
                    currentUser={currentUser}
                />
            ))}
            <div ref={bottomRef} />

            <AnimatedContextMenu
                visible={!!contextMenu}
                x={contextMenu?.x ?? 0}
                y={contextMenu?.y ?? 0}
                items={menuItems}
                onClose={closeMenu}
                menuRef={menuRef}
            />
        </div>
    );
};
