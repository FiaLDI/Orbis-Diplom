import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  setEditMode,
  setReply,
  clearActiveHistory,
  setActiveHistory,
  useLazyGetMessagesQuery,
  useRemoveMessageMutation,
} from "@/features/messages";
import { useContextMenu } from "@/shared/hooks";

const NEAR_BOTTOM_PX = 200;
const NEAR_TOP_PX = 300;

export function useMessagesListModel(confirm: any) {
  const dispatch = useAppDispatch();

  const activeChat = useAppSelector((s) => s.chat.activeChat);
  const activeHistory = useAppSelector((s) => s.message.activeHistory);
  const allHistories = useAppSelector((s) => s.message.histories);
  const currentUser = useAppSelector((s) => s.auth.user?.info);

  const [getMessages] = useLazyGetMessagesQuery();
  const [removeMessage] = useRemoveMessageMutation();

  const containerRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fetchingRef = useRef(false);
  const isPaginatingUpRef = useRef(false);

  const historyRef = useRef<typeof activeHistory>([]);
  useEffect(() => {
    historyRef.current = activeHistory ?? [];
  }, [activeHistory]);

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const { contextMenu, handleContextMenu, closeMenu, menuRef } = useContextMenu<
    any,
    HTMLUListElement
  >();

  // ===== Scroll indicators =====
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const distanceFromBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowScrollButton(distanceFromBottom >= NEAR_BOTTOM_PX);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // ===== Автоскролл вниз при новых сообщениях =====
  useEffect(() => {
    const el = containerRef.current;
    const bottom = bottomRef.current;
    if (!el || !bottom) return;

    // 🧠 если сейчас идёт пагинация вверх — не скроллим вниз
    if (isPaginatingUpRef.current) return;

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom < NEAR_BOTTOM_PX) {
      bottom.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeHistory?.length]);

  const handleScrollDown = () => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  // ===== Инициализация истории =====
  useEffect(() => {
    if (!activeChat?.id) {
      dispatch(clearActiveHistory());
      return;
    }

    dispatch(clearActiveHistory());
    setHasMore(true);

    if (allHistories[activeChat.id]?.length) {
      dispatch(setActiveHistory(allHistories[activeChat.id]));
    } else {
      getMessages({ id: activeChat.id }).catch(() => {});
    }
  }, [activeChat?.id]);

  // прокрутка вниз после первичной загрузки
  useEffect(() => {
    if (!activeHistory?.length) return;
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "auto" }),
      0,
    );
  }, [activeHistory]);

  // ===== Пагинация вверх =====
  useEffect(() => {
    const rootEl = containerRef.current;
    const topEl = topRef.current;
    if (!rootEl || !topEl || !activeChat?.id || !hasMore) return;

    const loadMore = async () => {
      if (fetchingRef.current) return;
      const oldestMessageId = historyRef.current?.[0]?.id;
      if (!oldestMessageId) return;

      fetchingRef.current = true;
      setIsLoadingMore(true);
      isPaginatingUpRef.current = true; // 🟢 ставим флаг

      const prevScrollHeight = rootEl.scrollHeight;
      const prevScrollTop = rootEl.scrollTop;

      try {
        const resp: any = await getMessages({
          id: activeChat.id,
          cursor: oldestMessageId,
        }).unwrap();
        const rows: any[] = Array.isArray(resp) ? resp : resp?.data;

        if (!rows?.length) {
          setHasMore(false);
          return;
        }

        const existing = historyRef.current ?? [];
        const existingIds = new Set(existing.map((m: any) => m.id));
        const merged = [
          ...rows.filter((m) => !existingIds.has(m.id)),
          ...existing,
        ];

        dispatch(setActiveHistory(merged));

        await new Promise((r) => requestAnimationFrame(r));
        const newScrollHeight = rootEl.scrollHeight;
        rootEl.scrollTop = newScrollHeight - prevScrollHeight + prevScrollTop;
      } catch (err) {
        console.error("Pagination error:", err);
      } finally {
        fetchingRef.current = false;
        setIsLoadingMore(false);
        isPaginatingUpRef.current = false;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (
          entry.isIntersecting &&
          rootEl.scrollTop <= NEAR_TOP_PX &&
          !fetchingRef.current
        ) {
          loadMore();
        }
      },
      {
        root: rootEl,
        rootMargin: `${NEAR_TOP_PX}px 0px 0px 0px`,
        threshold: 0.01,
      },
    );

    observer.observe(topEl);
    return () => observer.disconnect();
  }, [activeChat?.id, hasMore]);

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
      }),
    );
    closeMenu();
  };

  const handleRemoveMessage = async () => {
    const msg = contextMenu?.data;
    const ok = await confirm("Удалить сообщение?");
    if (!ok) return closeMenu();
    if (msg) removeMessage({ chat_id: msg.chat_id, id: msg.id });
    closeMenu();
  };

  const handleCopyMessage = () => {
    const msg = contextMenu?.data;
    if (msg) navigator.clipboard.writeText(msg.content?.[0]?.text ?? "");
    closeMenu();
  };

  return {
    isLoadingMore,
    showScrollButton,
    handleScrollDown,
    containerRef,
    topRef,
    bottomRef,
    currentUser,
    activeHistory,
    contextMenu,
    menuRef,
    handleContextMenu,
    closeMenu,
    handleReplyMessage,
    handleEditMessage,
    handleRemoveMessage,
    handleCopyMessage,
  };
}
