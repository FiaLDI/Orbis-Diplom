import React, { useMemo } from "react";
import { SingleMessageProps } from "./interface";
import { useAppSelector } from "@/app/hooks";
import { makeSelectIsMessageOpen } from "@/features/messages";
import { config } from "@/config";

const CoreComponent: React.FC<SingleMessageProps> = ({ message, onClick, currentUser }) => {
  const selectIsOpen = useMemo(
    () => makeSelectIsMessageOpen(String(message.id)),
    [message.id],
  );
  const isOpen = useAppSelector(selectIsOpen);

  // 🔹 Выбираем аватар (или дефолт)
  const avatarSrc =
  message.user_id === currentUser?.id && currentUser?.avatar_url
    ? currentUser.avatar_url // всегда берём актуальный из стора
    : message.avatar_url
    ? (message.avatar_url.startsWith("http")
        ? message.avatar_url
        : `${config.cdnServiceUrl}/${message.avatar_url}`)
    : "img/icon.png";

  return (
    <div
      onContextMenu={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => onClick?.(e, message)}
      className={
        isOpen
          ? "bg-[#7895f3] flex gap-5 lg:gap-3"
          : "flex gap-5 lg:gap-3"
      }
    >
      {/* 👤 Аватар */}
      <div className="self-start p-1">
        <img
          src={avatarSrc}
          alt={`Аватар ${message.username}`}
          className="w-20 h-20 lg:w-10 lg:h-10 rounded-full object-cover border border-[#ffffff33]"
        />
      </div>

      {/* 💬 Тело сообщения */}
      <div>
        <h3 className="text-3xl lg:text-base font-semibold">
          {message.username}{" "}
          <span className="text-2xl lg:text-sm opacity-70">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </h3>

        {/* 🧩 Контент сообщений */}
        {message.content?.map((val) => {
          if (!val) return null;

          // 💬 Текстовые сообщения
          if (val.type === "text") {
            return (
              <div
                key={val.id}
                className="text-3xl lg:text-base break-words whitespace-pre-wrap"
              >
                {val.text}
              </div>
            );
          }

          // 🖼️ Изображения
          if (val.type === "image" && val.url) {
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
          }

          // 📁 Файлы
          if (val.type === "file" && val.url) {
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
                      : `${config.cdnServiceUrl}/download?url=${encodeURIComponent(val.url)}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  Скачать
                </a>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export const Component = React.memo(
  CoreComponent,
  (prevProps, nextProps) => prevProps.message === nextProps.message,
);
