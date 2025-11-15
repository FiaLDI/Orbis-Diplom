import React from "react";
import { useTranslation } from "react-i18next";
import { Check, X, Upload, Trash2 } from "lucide-react";
import { config } from "@/config";
import type { SingleMessageProps } from "./interface";
import { useSingleMessageModel } from "@/features/messages/hooks";

export const SingleMessage: React.FC<SingleMessageProps> = ({
  message,
  onClick,
  currentUser,
}) => {
  const { t } = useTranslation("messages");
  const m = useSingleMessageModel(message, currentUser);

  const avatarSrc =
    message.userId === currentUser?.id && currentUser?.avatar_url
      ? currentUser.avatar_url
      : message.avatarUrl
        ? message.avatarUrl.startsWith("http")
          ? message.avatarUrl
          : `${config.cdnServiceUrl}/${message.avatarUrl}`
        : "img/icon.png";

  return (
    <div
      data-id={`message-${message.id}`}
      onContextMenu={(e) => onClick?.(e, message)}
      className="flex gap-5 lg:gap-3 rounded-lg p-2 hover:bg-foreground/50 transition"
      onDragOver={m.handleDragOver}
      onDrop={m.handleDrop}
    >
      <div className="self-start w-20 h-20 lg:w-10 lg:h-10">
        <img
          src={avatarSrc}
          alt={message.username}
          className="w-20 h-20 lg:w-10 lg:h-10 rounded-full object-cover shrink-0 border border-[#ffffff33]"
        />
      </div>

      <div className="flex-1">
        <h3 className="text-3xl lg:text-base font-semibold">
          {message.username}{" "}
          <span className="text-2xl lg:text-sm opacity-70">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </h3>

        {/* Reply preview */}
        {m.repliedMsg && (
          <div
            onClick={() => {
              const repliedId = m.repliedMsg?.id;
              if (!repliedId) return;

              const el = document.querySelector(
                `[data-id="message-${repliedId}"]`,
              ) as HTMLElement | null;

              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
                el.classList.add("bg-foreground", "transition-colors");
                setTimeout(() => el.classList.remove("bg-foreground"), 1500);
              }
            }}
            className="flex items-start gap-2 bg-foreground/70 rounded-md px-3 py-2 mb-2 cursor-pointer hover:bg-foreground transition"
          >
            <img
              src={
                m.repliedMsg?.avatarUrl
                  ? m.repliedMsg.avatarUrl.startsWith("http")
                    ? m.repliedMsg.avatarUrl
                    : `${config.cdnServiceUrl}/${m.repliedMsg.avatarUrl}`
                  : "img/icon.png"
              }
              alt={m.repliedMsg?.username ?? ""}
              className="w-6 h-6 rounded-full border border-[#ffffff33] object-cover mt-0.5"
            />
            <div className="flex flex-col flex-1 text-sm">
              <span className="font-semibold text-white">
                {m.repliedMsg?.username}
              </span>
              <span className="opacity-70 text-xs">
                {m.repliedMsg?.createdAt &&
                  new Date(m.repliedMsg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </span>
              {m.repliedMsg?.content?.[0]?.type === "text" ? (
                <div className="truncate max-w-[400px]">
                  {m.repliedMsg.content?.[0]?.text ?? ""}
                </div>
              ) : (
                <div className="italic text-blue-300">
                  {t(
                    m.repliedMsg?.content?.[0]?.type === "image"
                      ? "image"
                      : "file",
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit mode */}
        {m.isEditing ? (
          <div className="mt-1 flex flex-col gap-2">
            <input
              ref={m.inputRef}
              type="text"
              value={m.editText}
              onChange={(e) => m.setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") m.handleSave();
                if (e.key === "Escape") m.handleCancel();
              }}
              className="flex-1 bg-[#ffffff22] rounded-md px-2 py-1 outline-none text-white"
              placeholder={t("entertext")}
            />

            {m.attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-1">
                {m.attachedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="relative bg-[#ffffff11] p-2 rounded-md border border-[#ffffff22]"
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
                        m.setAttachedFiles((prev) =>
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
                onClick={() => m.fileInputRef.current?.click()}
                className="p-2 rounded-md bg-[#ffffff22] hover:bg-[#ffffff33]"
                title={t("action.addfile")}
              >
                <Upload size={16} />
              </button>
              <input
                ref={m.fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) =>
                  e.target.files && m.handleFilesSelect(e.target.files)
                }
              />
              <button
                onClick={m.handleSave}
                className="p-2 bg-green-500/20 hover:bg-green-500/40 rounded-md"
              >
                <Check size={16} />
              </button>
              <button
                onClick={m.handleCancel}
                className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-md"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <>
            {message.content?.map((val) => {
              if (val.type === "text")
                return (
                  <div
                    key={val.id}
                    className="text-3xl lg:text-base break-words whitespace-pre-wrap"
                  >
                    {val.text}
                    {message.isEdited && (
                      <span className="text-xs text-gray-400 ml-2">
                        {t("edited")}
                      </span>
                    )}
                  </div>
                );

              if (val.type === "image" && val.url)
                return (
                  <div key={val.id} className="my-2">
                    <img
                      src={
                        val.url
                          ? val.url.startsWith("http")
                            ? val.url
                            : `${config.cdnServiceUrl}/${val.url}`
                          : ""
                      }
                      alt={val.text || t("image")}
                      className="max-w-[600px] rounded-lg border border-[#ffffff22]"
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
                        val.url
                          ? val.url.startsWith("http")
                            ? val.url
                            : `${config.cdnServiceUrl}/download?url=${encodeURIComponent(
                                val.url,
                              )}`
                          : "#"
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 underline hover:text-blue-300"
                    >
                      {t("download")}
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
  SingleMessage,
  (prev, next) => prev.message === next.message,
);
