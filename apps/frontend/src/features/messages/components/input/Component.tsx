import React, { useState, ChangeEvent, useRef, DragEvent } from "react";
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

export const Component: React.FC = () => {
  const dispatch = useAppDispatch();
  const [createMessage] = useCreateMessageMutation();

  const activeChat = useAppSelector((s) => s.chat.activeChat);
  const replyTo = useAppSelector((s) => s.message.reply);
  const auth = useAppSelector((s) => s.auth.user?.info);
  const upload = useAppSelector((s) => s.upload);

  const { socket } = useChatSocket();
  const { typingUsers } = useChatMessages();

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [isDragging, setIsDragging] = useState(false); // 🟢 глобальный drag overlay

  // 🧩 drag events на всём окне
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
      // чтобы не пропадало мгновенно при входе/выходе из дочерних элементов
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

  /** 🧩 обычный выбор файлов */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    dispatch(uploadFiles(Array.from(e.target.files)));
    e.target.value = "";
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  /** 🧩 создание контента */
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

  /** 📨 отправка */
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

  /** ✏️ typing */
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

  return (
    <>
      {/* 🔹 глобальный overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 bg-[#00000088] backdrop-blur-sm border-4 border-dashed border-white flex flex-col items-center justify-center text-white text-xl">
          <Upload size={64} strokeWidth={1.5} className="mb-3" />
          <p className="font-semibold text-2xl">
            Отпустите файлы, чтобы загрузить
          </p>
        </div>
      )}

      {/* основной блок */}
      <div className="flex flex-col gap-2 p-3 bg-[#25309b] relative">
        {/* 💬 typing */}
        {typingUsers.length > 0 && (
          <p className="text-sm text-gray-300 italic">
            {typingUsers.length > 4
              ? "Много пользователей печатают..."
              : `${typingUsers.join(", ")} ${
                  typingUsers.length > 1 ? "печатают..." : "печатает..."
                }`}
          </p>
        )}

        {/* 📂 файлы */}
        {upload.files?.length > 0 && (
          <div className="flex flex-wrap gap-2 text-sm text-white">
            {upload.files.map((f) => (
              <div
                key={f.name}
                className="bg-[#ffffff22] px-2 py-1 rounded-md flex items-center gap-2"
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

        {/* 🧩 инпут и кнопки */}
        <div className="flex items-center gap-3">
          {/* кнопка загрузки */}
          <button
            onClick={handleUploadClick}
            className="p-2 rounded-lg bg-[#ffffff22] hover:bg-[#ffffff33] transition"
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
            className="flex-1 bg-[#25309b88] text-white rounded-lg p-2 outline-none"
            placeholder="Введите сообщение..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          {/* отправка */}
          <button
            onClick={handleSend}
            disabled={upload.loading}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Отправить
          </button>
        </div>
      </div>
    </>
  );
};
