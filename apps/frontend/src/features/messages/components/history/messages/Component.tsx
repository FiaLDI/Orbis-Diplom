import React, { useMemo } from "react";
import { SingleMessageProps } from "./interface";
import { useAppSelector } from "@/app/hooks";
import { makeSelectIsMessageOpen } from "@/features/messages";
import { config } from "@/config";

const CoreComponent: React.FC<SingleMessageProps> = ({ message, onClick }) => {
  const selectIsOpen = useMemo(
    () => makeSelectIsMessageOpen(String(message.id)),
    [message.id],
  );
  const isOpen = useAppSelector(selectIsOpen);

  return (
    <div
      onContextMenu={onClick}
      className={
        isOpen
          ? "bg-[#7895f3] flex gap-5 lg:gap-3"
          : "flex gap-5 lg:gap-3"
      }
    >
      {/* 👤 Аватар */}
      <div className="self-start p-1">
        <img
          src="/img/icon.png"
          alt={`Аватар ${message.username}`}
          className="w-20 h-20 lg:w-10 lg:h-10 rounded-full object-cover"
        />
      </div>

      {/* 💬 Тело сообщения */}
      <div>
        <h3 className="text-3xl lg:text-base font-semibold">
          {message.username}{" "}
          <span className="text-2xl lg:text-sm opacity-70">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
          if (val.type === "image") {
            
            if (!val.url) return null;
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
          if (val.type === "file") {
            
            if (!val.url) return null;
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
