import React from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setActiveChat } from "@/features/chat";
import { ChatContextMenu } from "@/features/shared";
import { Props } from "./inteface";

export const Component: React.FC<Props> = ({ chat, isServer }) => {
  const dispatch = useAppDispatch();
  const activeChat = useAppSelector((s) => s.chat.activeChat);

  return (
    <ChatContextMenu
      chat={chat}
      triggerElement={({ onContextMenu }) => (
        <li
          className="cursor-pointer hover:brightness-90 select-none"
          onClick={() => dispatch(setActiveChat(chat))}
          onContextMenu={onContextMenu}
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
      )}
    />
  );
};
