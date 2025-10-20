import React, { useState, ChangeEvent, useRef, DragEvent, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  setReply,
  leaveEditMode,
} from "@/features/messages";
import { useCreateMessageMutation } from "@/features/messages";
import type { Message, Content } from "@/features/messages/types";
import { useChatSocket } from "@/features/chat/hooks/useChatSocket";
import { useChatMessages } from "@/features/chat";
import { uploadFiles, resetUpload } from "@/features/upload";
import { Upload } from "lucide-react";
import {Component as TypingIndicator} from "./typingindicator"

export const Component: React.FC = () => {
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

  React.useEffect(() => {
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

    const newMessage: Message = {
      id: Date.now(),
      chat_id: Number(activeChat.id),
      user_id: Number(auth?.id ?? 0),
      username: auth?.username ?? "Unknown",
      is_edited: false,
      timestamp: new Date().toISOString(),
      reply_to_id: replyTo ? Number(replyTo) : undefined,
      content,
    };

    try {
      await createMessage({
        chat_id: Number(activeChat.id),
        content: newMessage.content,
        reply_to_id: newMessage.reply_to_id,
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
    const el = document.querySelector(`[data-id="message-${replyTo}"]`) as HTMLElement | null;
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("bg-[#4f6fff66]", "transition-colors");

    setTimeout(() => {
      el.classList.remove("bg-[#4f6fff66]");
    }, 1500);
  };

  return (
    <>
      {isDragging && (
        <div className="fixed inset-0 z-50 bg-background backdrop-blur-sm border-4 border-dashed border-white flex flex-col items-center justify-center text-white text-xl">
          <Upload size={64} strokeWidth={1.5} className="mb-3" />
          <p className="font-semibold text-2xl">
            Отпустите файлы, чтобы загрузить
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2 p-3 bg-background relative">
        {typingUsers.length > 0 && (
          <TypingIndicator users={typingUsers} />
        )}

        {upload.files?.length > 0 && (
          <div className="flex flex-wrap gap-2 text-sm text-white">
            {upload.files.map((f) => (
              <div
                key={f.name}
                className="bg-foreground/20 px-2 py-1 rounded-md flex items-center gap-2"
              >
                <span>{f.name}</span>
                {f.progress < 100 ? (
                  <span className="text-gray-300">{f.progress}%</span>
                ) : (
                  <span className="text-green-400">✓</span>
                )}
              </div>
            ))}
          </div>
        )}

        {(repliedMsg && replyTo) && (
          <div
            onClick={handleScrollToReplied}
            className="flex items-center justify-between bg-[#1d2fa188] px-3 py-2 rounded-lg text-sm text-white cursor-pointer hover:bg-[#3041e088] transition"
          >
            <div className="flex flex-col">
              <span className="opacity-70 text-xs mb-0.5">💬 Ответ на сообщение:</span>

              {repliedMsg ? (
                repliedMsg.content?.[0]?.type === "text" ? (
                  <span className="font-semibold truncate max-w-[280px]">
                    “{repliedMsg.content[0].text}”
                  </span>
                ) : repliedMsg.content?.[0]?.type === "image" ? (
                  <span className="italic text-blue-300">🖼 Изображение</span>
                ) : (
                  <span className="italic text-blue-300">📎 Файл</span>
                )
              ) : (
                <span className="italic opacity-60">Не найдено</span>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(setReply(undefined));
              }}
              className="text-white opacity-70 hover:opacity-100 transition"
              title="Отменить ответ"
            >
              ✕
            </button>
          </div>
        )}



        {/* 🧩 инпут и кнопки */}
        <div className="flex items-center gap-3">
          
          {/* кнопка загрузки */}
          <button
            onClick={handleUploadClick}
            className="p-2 rounded-lg bg-foreground hover:bg-foreground/33 transition"
            title="Загрузить файл"
          >
            <Upload size={24} color="#fff" strokeWidth={1.75} />
          </button>

          {/* скрытый input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          {/* поле ввода */}
          <input
            type="text"
            className="flex-1 bg-foreground text-white rounded-lg p-2 outline-none"
            placeholder="Введите сообщение..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          {/* отправка */}
          <button
            onClick={handleSend}
            disabled={upload.loading}
            className="bg-foreground hover:bg-foreground/110 text-white px-4 py-2 rounded-lg"
          >
            Отправить
          </button>
          
        </div>
      </div>
    </>
  );
};
