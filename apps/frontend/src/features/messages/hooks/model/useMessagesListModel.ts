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
  const prevScrollHeightRef = useRef(0);
  const prevScrollTopRef = useRef(0);

  // всегда иметь актуальный снапшот истории внутри колбэков observer
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

  /* ===== Scroll indicators ===== */
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

  /* ===== Автоскролл вниз при новых сообщениях (если близко к низу) ===== */
  useEffect(() => {
    const el = containerRef.current;
    const bottom = bottomRef.current;
    if (!el || !bottom) return;

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom < NEAR_BOTTOM_PX) {
      bottom.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeHistory?.length]);

  const handleScrollDown = () => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  /* ===== Инициализация истории ===== */
  useEffect(() => {
    if (!activeChat?.id) {
      dispatch(clearActiveHistory());
      return;
    }

    // очистка активной ленты при смене чата, чтобы не мигало
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

  /* ===== Пагинация вверх (IntersectionObserver + cursor) ===== */
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

      try {
        const resp = (await getMessages({
          id: activeChat.id,
          cursor: oldestMessageId,
        }).unwrap()) as any;

        const rows: any[] = Array.isArray(resp) ? resp : resp?.data;

        if (!rows || rows.length === 0) {
          setHasMore(false);
          return;
        }

        // prepend без дублей
        const existing = historyRef.current ?? [];
        const existingIds = new Set(existing.map((m: any) => m.id));
        const merged = [
          ...rows.filter((m) => !existingIds.has(m.id)),
          ...existing,
        ];

        // фиксация позиции ДО рендера — уже сохранена снаружи
        await new Promise((r) => requestAnimationFrame(r));
        dispatch(setActiveHistory(merged));

        // ждём рендер и компенсируем позицию
        await new Promise((r) => requestAnimationFrame(r));
        const newScrollHeight = rootEl.scrollHeight;
        const added = newScrollHeight - prevScrollHeightRef.current;

        if (prevScrollTopRef.current > 10) {
          rootEl.scrollTop = prevScrollTopRef.current + added;
        } else {
          rootEl.scrollTop = 0; // если были совсем у верха — остаёмся у верха
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Pagination error:", err);
      } finally {
        fetchingRef.current = false;
        setIsLoadingMore(false);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const nearTop = rootEl.scrollTop <= NEAR_TOP_PX;

        if (entry.isIntersecting && nearTop && !fetchingRef.current) {
          // фиксируем позицию ДО запроса
          prevScrollHeightRef.current = rootEl.scrollHeight;
          prevScrollTopRef.current = rootEl.scrollTop;
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

    if (
      (historyRef.current?.length ?? 0) > 0 &&
      rootEl.scrollTop <= NEAR_TOP_PX &&
      !fetchingRef.current
    ) {
      prevScrollHeightRef.current = rootEl.scrollHeight;
      prevScrollTopRef.current = rootEl.scrollTop;
      loadMore();
    }

    return () => observer.disconnect();
  }, [activeChat?.id]);

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
    if (!ok) closeMenu();
    if (msg) {
      removeMessage({ chat_id: msg.chat_id, id: msg.id });
    }
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
