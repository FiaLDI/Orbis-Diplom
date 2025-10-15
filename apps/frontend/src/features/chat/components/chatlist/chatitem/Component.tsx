import React, { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { chat, setActiveChat } from "@/features/chat";
import { setActivePersonalCommunicate } from "@/features/action";
import { Component as ChatEditForm} from "./edit";
import { useDeleteChatMutation, useEmitServerUpdate } from "@/features/server";

interface Props {
  chat: chat;
  isServer?: boolean;
}

export const Component: React.FC<Props> = ({ chat, isServer }) => {
  const activeChat = useAppSelector((state) => state.chat.activeChat);
  const activeServer = useAppSelector((state) => state.server.activeserver);
  const dispatch = useAppDispatch();

  const [ deleteChat ] = useDeleteChatMutation();
    const emitServerUpdate = useEmitServerUpdate();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; chat: chat } | null>(null);
  const [editingChat, setEditingChat] = useState<any | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // ⛔ блокируем глобальное меню
    setContextMenu({ x: e.pageX, y: e.pageY, chat });
  };

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    if (contextMenu) document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [contextMenu]);

  return (
    <>
      <li
        className="cursor-pointer hover:brightness-90 select-none"
        onClick={() => {
          dispatch(setActiveChat(chat));
          dispatch(setActivePersonalCommunicate(window.innerWidth > 1024 || false));
        }}
        onContextMenu={handleContextMenu}
      >
        <div
          className={
            activeChat?.id === chat.id
              ? "flex bg-[#ffffff3a] gap-3 items-center p-2 rounded-[5px]"
              : "flex gap-3 items-center p-2"
          }
        >
          {!isServer && (
            <div className="w-fit">
              <img
                src={chat.avatar_url || "/img/icon.png"}
                alt=""
                className="w-20 h-20 lg:w-7 lg:h-7"
              />
            </div>
          )}
          <div className="text-3xl lg:text-base truncate w-full shrink-10 lg:max-w-50">
            {chat.name}
          </div>
        </div>
      </li>

      {/* Локальное контекстное меню */}
      {contextMenu && (
        <div
          ref={menuRef}
          className="fixed z-[10000] bg-[#1e293b] text-white rounded shadow-lg py-2"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            onClick={() => {
              setEditingChat(chat);
              setContextMenu(null);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-blue-600"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => {
                if(!activeServer?.id) return;
              deleteChat({id: activeServer?.id, chatId: chat.id});
              emitServerUpdate(activeServer?.id);
              setContextMenu(null);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-red-600"
          >
            🗑️ Delete
          </button>
        </div>
      )}

      {editingChat && (
        <ChatEditForm
            initialData={editingChat}
            onClose={() => {
                setEditingChat(null)
            }}
            onSave={()=>{
                emitServerUpdate(activeServer?.id);
            }}
        />
        )}
    </>
  );
};
