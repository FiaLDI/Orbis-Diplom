import {
  useEffect,
  useMemo,
  useRef,
  useState,
  ChangeEvent,
  DragEvent,
} from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setReply, leaveEditMode } from "@/features/messages";
import { useCreateMessageMutation } from "@/features/messages";
import type { Content } from "@/features/messages/types";
import { useChatSocket } from "@/features/chat/hooks/useChatSocket";
import { useChatMessages } from "@/features/chat";
import { uploadFiles, resetUpload } from "@/features/upload";

export function useMessageInputModel() {
  const dispatch = useAppDispatch();
  const [createMessage] = useCreateMessageMutation();

  const activeChat = useAppSelector((s) => s.chat.activeChat);
  const replyTo = useAppSelector((s) => s.message.reply);
  const auth = useAppSelector((s) => s.auth.user?.info);
  const upload = useAppSelector((s) => s.upload);
  const allHistories = useAppSelector((s) => s.message.histories);

  const { socket } = useChatSocket();
  const { typingUsers } = useChatMessages();

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const repliedMsg = useMemo(() => {
    if (!replyTo || !activeChat?.id) return null;
    const messages = allHistories?.[activeChat?.id] ?? [];
    return messages.find((m) => String(m.id) === String(replyTo)) ?? null;
  }, [replyTo, activeChat?.id, allHistories]);

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer?.files?.length) {
        dispatch(uploadFiles(Array.from(e.dataTransfer.files)));
      }
    };
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      if (e.clientX === 0 && e.clientY === 0) setIsDragging(false);
    };

    window.addEventListener("dragover", handleDragOver as any);
    window.addEventListener("drop", handleDrop as any);
    window.addEventListener("dragleave", handleDragLeave as any);

    return () => {
      window.removeEventListener("dragover", handleDragOver as any);
      window.removeEventListener("drop", handleDrop as any);
      window.removeEventListener("dragleave", handleDragLeave as any);
    };
  }, [dispatch]);

  // file upload handlers
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    dispatch(uploadFiles(Array.from(e.target.files)));
    e.target.value = "";
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const createContentArray = (): Content[] => {
    const content: Content[] = [];

    if (inputValue.trim()) {
      content.push({
        id: crypto.randomUUID(),
        type: "text",
        text: inputValue.trim(),
      });
    }

    const uploadedUrls =
      upload.files?.filter((f) => f.url && !f.error).map((f) => f.url!) || [];

    for (const url of uploadedUrls) {
      const fileName = url.split("/").pop() || "file";
      const fileType = /\.(jpg|jpeg|png|gif)$/i.test(fileName)
        ? "image"
        : "file";
      content.push({
        id: crypto.randomUUID(),
        type: fileType,
        url,
        text: fileName,
      });
    }

    return content;
  };

  const handleSend = async () => {
    if (!activeChat?.id) return;
    if (!inputValue.trim() && upload.files.length === 0) return;

    const content = createContentArray();
    if (!content.length) return;

    try {
      await createMessage({
        chatId: activeChat.id,
        content,
        replyToId: replyTo ? replyTo : undefined,
      }).unwrap();
    } catch (err) {
      console.error("Ошибка при отправке:", err);
    }

    dispatch(resetUpload());
    dispatch(setReply(undefined));
    dispatch(leaveEditMode());
    setInputValue("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputValue(text);
    if (!socket || !activeChat?.id || !auth?.username) return;

    socket.emit("typing-start", activeChat.id, auth.username);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing-stop", activeChat.id, auth.username);
    }, 2000);
  };

  const handleScrollToReplied = () => {
    if (!replyTo) return;
    const el = document.querySelector(
      `[data-id="message-${replyTo}"]`,
    ) as HTMLElement | null;
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("bg-[#4f6fff66]", "transition-colors");
    setTimeout(() => el.classList.remove("bg-[#4f6fff66]"), 1500);
  };

  const cancelReply = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    dispatch(setReply(undefined));
  };

  return {
    fileInputRef,
    inputValue,
    setInputValue,
    isDragging,
    typingUsers,
    upload,
    repliedMsg,
    replyTo,
    handleUploadClick,
    handleFileChange,
    handleInputChange,
    handleSend,
    handleScrollToReplied,
    cancelReply,
  };
}
