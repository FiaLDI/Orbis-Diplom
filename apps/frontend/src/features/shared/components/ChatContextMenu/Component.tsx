import React, { useState } from "react";
import { chat, setActiveChat } from "@/features/chat";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useDeleteChatMutation, useEmitServerUpdate } from "@/features/server";
import { ChatEditForm, useDeletePersonalChatMutation } from "@/features/chat";
import { useContextMenu } from "@/features/shared";
import { AnimatedContextMenu } from "../AnimatedContextMenu";
import { Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ChatContextMenuProps {
    triggerElement: (handlers: { onContextMenu: (e: React.MouseEvent) => void }) => React.ReactNode;
    chat: chat;
}

export const ChatContextMenu: React.FC<ChatContextMenuProps> = ({ triggerElement, chat }) => {
    const activeServer = useAppSelector((s) => s.server.activeserver);
    const activeChat = useAppSelector((s) => s.chat.activeChat);
    const [deleteServerChat] = useDeleteChatMutation();
    const [deleteChat] = useDeletePersonalChatMutation();
    const emitServerUpdate = useEmitServerUpdate();
    const [editingChat, setEditingChat] = useState<chat | null>(null);
    const { t } = useTranslation("chat");
    const dispatch = useAppDispatch();

    const { contextMenu, handleContextMenu, menuRef, closeMenu } = useContextMenu<
        chat,
        HTMLUListElement
    >();

    const menuItems = [
        {
            label: t("chat.edit.title"),
            action: () => setEditingChat(contextMenu?.data ?? null),
            icon: <Pencil size={16} />,
        },
        {
            label: t("chat.edit.delete"),
            action: () => {
                if (!activeServer?.id) {
                    
                    if (!confirm(`${t("chat.edit.delete")}?`)) return;
                    if (contextMenu?.data.id == activeChat?.id) {
                        dispatch(setActiveChat(undefined))
                    }
                    deleteChat(contextMenu?.data.id)
                }

                if (!activeServer?.id || !contextMenu?.data) return;
                if (!confirm(`${t("chat.edit.delete")}?`)) return;
                deleteServerChat({ id: activeServer.id, chatId: contextMenu.data.id });
                emitServerUpdate(activeServer.id);
            },
            icon: <Trash2 size={16} />,
            danger: true,
        },
    ];

    return (
        <>
            {triggerElement({ onContextMenu: (e) => handleContextMenu(e, chat) })}

            <AnimatedContextMenu
                visible={!!contextMenu}
                x={contextMenu?.x ?? 0}
                y={contextMenu?.y ?? 0}
                items={menuItems}
                onClose={closeMenu}
                menuRef={menuRef}
            />

            {editingChat && (
                <ChatEditForm
                    initialData={editingChat}
                    onClose={() => setEditingChat(null)}
                    onSave={() => {
                        emitServerUpdate(activeServer?.id);
                        setEditingChat(null);
                    }}
                />
            )}
        </>
    );
};
