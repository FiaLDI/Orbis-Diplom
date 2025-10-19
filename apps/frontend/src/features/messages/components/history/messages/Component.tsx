import React, { useMemo, useRef, useState, useEffect } from "react";
import { SingleMessageProps } from "./interface";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  makeSelectIsMessageOpen,
  leaveEditMode,
  updateMessageInHistory,
  useEditMessageMutation,
} from "@/features/messages";
import { resetUpload, uploadFiles } from "@/features/upload";
import { config } from "@/config";
import { Check, X, Upload, Trash2 } from "lucide-react";
import type { MessageContent } from "@/features/messages/types";

const CoreComponent: React.FC<SingleMessageProps> = ({
  message,
  onClick,
  currentUser,
}) => {
  const dispatch = useAppDispatch();
  const selectIsOpen = useMemo(
    () => makeSelectIsMessageOpen(String(message.id)),
    [message.id],
  );
  const isOpen = useAppSelector(selectIsOpen);
  const editmode = useAppSelector((s) => s.message.editmode);
  const [updateMessage] = useEditMessageMutation();

  const isEditing =
    editmode?.enabled && editmode.messagesId === String(message.id);

  const [editText, setEditText] = useState(message.content?.[0]?.text ?? "");
  const [attachedFiles, setAttachedFiles] = useState<MessageContent[]>(
    message.content?.filter((c) => c.type !== "text") || [],
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allHistories = useAppSelector((s) => s.message.histories);
  const activeChatId = useAppSelector((s) => s.chat.activeChat?.id);

  const repliedMsg = useMemo(() => {
    if (!message.reply_to_id || !activeChatId) return null;
    const messages = allHistories?.[activeChatId] ?? [];
    return messages.find((m) => m.id === message.reply_to_id) ?? null;
  }, [message.reply_to_id, activeChatId, allHistories]);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const avatarSrc =
    message.user_id === currentUser?.id && currentUser?.avatar_url
      ? currentUser.avatar_url
      : message.avatar_url
      ? message.avatar_url.startsWith("http")
        ? message.avatar_url
        : `${config.cdnServiceUrl}/${message.avatar_url}`
      : "img/icon.png";

  const handleFilesSelect = async (files: FileList | File[]) => {
    const arr = Array.from(files);
    const uploadedUrls = await dispatch(uploadFiles(arr)).unwrap(); // string[]

    const mapped: MessageContent[] = uploadedUrls.map((url) => {
      const name = url.split("/").pop() || "file";
      const type: "image" | "file" =
        /\.(jpg|jpeg|png|gif|webp)$/i.test(name) ? "image" : "file";

      return {
        id: crypto.randomUUID(),
        type,
        url,
        text: name,
      };
    });

    setAttachedFiles((prev) => [...prev, ...mapped]);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) handleFilesSelect(e.dataTransfer.files);
  };

  const handleSave = async () => {
    const textContent: MessageContent[] = editText.trim()
      ? [{ id: crypto.randomUUID(), type: "text", text: editText.trim() }]
      : [];

    const content: MessageContent[] = [...textContent, ...attachedFiles];

    if (!content.length) {
      dispatch(leaveEditMode());
      return;
    }

    try {
      await updateMessage({ id: message.id, content }).unwrap();
      dispatch(
        updateMessageInHistory({
          ...message,
          content,
          is_edited: true,
        }),
      );
      dispatch(resetUpload());
    } catch (e) {
      console.error("Ошибка при обновлении:", e);
    }

    dispatch(leaveEditMode());
  };

  const handleCancel = () => {
    dispatch(leaveEditMode());
    setEditText(message.content?.[0]?.text ?? "");
    setAttachedFiles(message.content?.filter((c) => c.type !== "text") || []);
  };

  return (
    <div
      data-id={`message-${message.id}`}
      onContextMenu={(e) => onClick?.(e, message)}
      className={`flex gap-5 lg:gap-3 rounded-lg p-2 ${
        isOpen ? "bg-[#7895f3]" : "hover:bg-[#ffffff11] transition"
      }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="self-start p-1">
        <img
          src={avatarSrc}
          alt={`Аватар ${message.username}`}
          className="w-20 h-20 lg:w-10 lg:h-10 rounded-full object-cover border border-[#ffffff33]"
        />
      </div>

      <div className="flex-1">
        <h3 className="text-3xl lg:text-base font-semibold">
          {message.username}{" "}
          <span className="text-2xl lg:text-sm opacity-70">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </h3>

        {repliedMsg && (
  <div
    onClick={() => {
      const el = document.querySelector(
        `[data-id="message-${repliedMsg.id}"]`,
      ) as HTMLElement | null;
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("bg-[#4f6fff66]", "transition-colors");
        setTimeout(() => el.classList.remove("bg-[#4f6fff66]"), 1500);
      }
    }}
    className="flex items-start gap-2 bg-[#1d2fa155] rounded-md px-3 py-2 mb-2 cursor-pointer hover:bg-[#2e45e055] transition"
  >
    <img
      src={
        repliedMsg.avatar_url
          ? repliedMsg.avatar_url.startsWith("http")
            ? repliedMsg.avatar_url
            : `${config.cdnServiceUrl}/${repliedMsg.avatar_url}`
          : "img/icon.png"
      }
      alt={`Аватар ${repliedMsg.username}`}
      className="w-6 h-6 rounded-full border border-[#ffffff33] object-cover mt-0.5"
    />

    <div className="flex flex-col flex-1">
      <div className="flex items-center gap-2 text-xs text-gray-300">
        <span className="font-semibold text-white">{repliedMsg.username}</span>
        <span className="opacity-70">
          {new Date(repliedMsg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {repliedMsg.content?.[0]?.type === "text" ? (
        <div className="text-sm text-white truncate max-w-[400px]">
          {repliedMsg.content[0].text}
        </div>
          ) : repliedMsg.content?.[0]?.type === "image" ? (
            <div className="flex items-center gap-1 text-blue-300 text-sm">
              🖼 <span className="italic">Изображение</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-blue-300 text-sm">
              📎 <span className="italic">Файл</span>
            </div>
          )}
          </div>
        </div>
      )}

        {isEditing ? (
          <div className="mt-1 flex flex-col gap-2">
            <input
              ref={inputRef}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
              className="flex-1 bg-[#ffffff22] rounded-md px-2 py-1 outline-none text-white"
              placeholder="Введите текст..."
            />

            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-1">
                {attachedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="relative bg-[#ffffff11] p-2 rounded-md border border-[#ffffff22] max-w-[200px]"
                  >
                    {file.type === "image" && file.url ? (
                      <img
                        src={
                          file.url.startsWith("http")
                            ? file.url
                            : `${config.cdnServiceUrl}/${file.url}`
                        }
                        className="w-full h-auto rounded"
                        alt={file.text}
                      />
                    ) : (
                      <p className="truncate text-white">{file.text}</p>
                    )}

                    <button
                      onClick={() =>
                        setAttachedFiles((prev) =>
                          prev.filter((f) => f.id !== file.id),
                        )
                      }
                      className="absolute -top-2 -right-2 bg-red-500/70 hover:bg-red-500 text-white rounded-full p-1"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-md bg-[#ffffff22] hover:bg-[#ffffff33]"
                title="Добавить файл"
              >
                <Upload size={16} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) =>
                  e.target.files && handleFilesSelect(e.target.files)
                }
              />
              <button
                onClick={handleSave}
                className="p-2 bg-green-500/20 hover:bg-green-500/40 rounded-md"
                title="Сохранить"
              >
                <Check size={16} />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-md"
                title="Отменить"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <>
            {message.content?.map((val) => {
              if (!val) return null;

              if (val.type === "text")
                return (
                  <div
                    key={val.id}
                    className="text-3xl lg:text-base break-words whitespace-pre-wrap"
                  >
                    {val.text}
                    {message.is_edited && (
                      <span className="text-xs text-gray-400 ml-2">
                        (edited)
                      </span>
                    )}
                  </div>
                );

              if (val.type === "image" && val.url)
                return (
                  <div key={val.id} className="my-2">
                    <img
                      src={
                        val.url.startsWith("http")
                          ? val.url
                          : `${config.cdnServiceUrl}/${val.url}`
                      }
                      alt={val.text || "Изображение"}
                      className="max-w-[700px] rounded-lg border border-[#ffffff22]"
                    />
                  </div>
                );

              if (val.type === "file" && val.url)
                return (
                  <div
                    key={val.id}
                    className="text-3xl lg:text-base flex items-center gap-2"
                  >
                    <span>{val.text}</span>
                    <a
                      href={
                        val.url.startsWith("http")
                          ? val.url
                          : `${config.cdnServiceUrl}/download?url=${encodeURIComponent(
                              val.url,
                            )}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 underline hover:text-blue-300"
                    >
                      Скачать
                    </a>
                  </div>
                );

              return null;
            })}
          </>
        )}
      </div>
    </div>
  );
};

export const Component = React.memo(
  CoreComponent,
  (prev, next) => prev.message === next.message,
);
