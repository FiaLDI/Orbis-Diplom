import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Component as SingleMessage } from "./messages";
import {
  setEditMode,
  setOpenMessage,
  setReply,
  clearActiveHistory,
  setActiveHistory,
} from "@/features/messages";
import {
  useLazyGetMessagesQuery,
  useRemoveMessageMutation,
} from "@/features/messages";
import { useChatMessages } from "@/features/chat";

export const Component: React.FC<{
  bottomRef: React.RefObject<HTMLDivElement>;
  topRef: React.RefObject<HTMLDivElement>;
}> = ({ bottomRef, topRef }) => {
  useChatMessages()
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const offsetRef = useRef(0);
  const fetchingRef = useRef(false);

  const dispatch = useAppDispatch();
  const activeChat = useAppSelector((s) => s.chat.activeChat);
  const activeHistory = useAppSelector((s) => s.message.activeHistory);
  const allHistories = useAppSelector((s) => s.message.histories);
  const currentUser = useAppSelector(s => s.auth.user?.info);


  const [getMessages] = useLazyGetMessagesQuery();
  const [removeMessage] = useRemoveMessageMutation();

  const menuRef = useRef<HTMLUListElement>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const isOpen = useAppSelector((s) => s.message.openMessage);
  const containerRef = useRef<HTMLDivElement>(null);

  /** закрытие контекстного меню при клике вне */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** контекстное меню сообщения */
  const handleMessageClick = (e: React.MouseEvent, message: any) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuPosition({ x: e.pageX, y: e.pageY });
    setMenuVisible(true);
    dispatch(setOpenMessage(message));
  };

  /** загрузка истории при смене чата */
    useEffect(() => {
  if (!activeChat?.id) return;

  // если история уже есть в кеше — покажи её сразу
  if (allHistories[activeChat.id]?.length) {
    dispatch(setActiveHistory(allHistories[activeChat.id]));
    return;
  }

  dispatch(clearActiveHistory());
  setHasMore(true);
  offsetRef.current = 0;
  setOffset(0);
  getMessages({ id: activeChat.id, offset: 0 }).catch(() => {});
}, [activeChat?.id]);


  /** автопрокрутка вниз после первой загрузки */
  useEffect(() => {
    if (!activeHistory?.length || offset !== 0) return;
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }, 0);
  }, [activeHistory, offset, bottomRef]);

  /** догрузка сообщений при скролле вверх */
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
          const data = await getMessages({
            id: activeChat.id,
            offset: newOffset,
          });

          if (!data?.data?.length) setHasMore(false);

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
  }, [activeChat?.id, getMessages, hasMore]);

  /** обработчики контекстного меню */
  const handleOptionClick = (option: string) => {
    setMenuVisible(false);
    dispatch(setOpenMessage(undefined));
  };

  const handleReplyMessage = () => {
    dispatch(setReply(String(isOpen?.id)));
    dispatch(setOpenMessage(undefined));
    setMenuVisible(false);
  };

  const handleEditMessage = () => {
    if (!isOpen?.id || !isOpen.chat_id) return;
    dispatch(
      setEditMode({
        enabled: true,
        messagesId: String(isOpen.id),
        chatId: String(isOpen.chat_id),
      }),
    );
    setMenuVisible(false);
  };

  const handleRemoveMessage = () => {
    if (confirm("Вы уверены? ") && isOpen) {
      removeMessage({ chat_id: isOpen.chat_id, id: isOpen.id });
    }
    setMenuVisible(false);
  };

  const handleCopyMessage = () => {
    if (!isOpen) return;
    navigator.clipboard.writeText(isOpen.content?.[0]?.text ?? "");
    setMenuVisible(false);
  };

  /** отображение */
  return (
    <div
      ref={containerRef}
      className="overflow-y-auto bg-[#25309b88] p-4 h-[calc(100vh_-_370px)] lg:h-screen text-white flex flex-col gap-3"
    >
      <div ref={topRef} />
      {activeHistory?.map((message, idx) => (
        <SingleMessage
          key={`single-${message.chat_id}-${idx}`}
          message={message}
          onClick={(e) => handleMessageClick(e, message)}
          currentUser={currentUser}
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
