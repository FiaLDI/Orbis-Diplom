import React from "react";
import { Upload } from "lucide-react";
import { Component as TypingIndicator } from "./typingindicator";
import { useMessageInputModel } from "../../hooks";

export const MessageInput: React.FC = () => {
    const m = useMessageInputModel();

    return (
        <>
            {m.isDragging && (
                <div className="fixed inset-0 z-50 bg-background backdrop-blur-sm border-4 border-dashed border-white flex flex-col items-center justify-center text-white text-xl">
                    <Upload size={64} strokeWidth={1.5} className="mb-3" />
                    <p className="font-semibold text-2xl">Отпустите файлы, чтобы загрузить</p>
                </div>
            )}

            <div className="flex flex-col gap-2 p-3 bg-background/50 backdrop-blur-sm  relative">
                {m.typingUsers.length > 0 && <TypingIndicator users={m.typingUsers} />}

                {m.upload.files?.length > 0 && (
                    <div className="flex flex-wrap gap-2 text-sm text-white">
                        {m.upload.files.map((f) => (
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

                {m.repliedMsg && m.replyTo && (
                    <div
                        onClick={m.handleScrollToReplied}
                        className="flex items-center justify-between bg-foreground px-3 py-2 rounded-lg text-sm text-white cursor-pointer hover:bg-[#3041e088] transition"
                    >
                        <div className="flex flex-col">
                            <span className="opacity-70 text-xs mb-0.5">
                                💬 Ответ на сообщение:
                            </span>
                            {m.repliedMsg?.content?.[0]?.type === "text" ? (
                                <span className="font-semibold truncate max-w-[280px]">
                                    “{m.repliedMsg.content[0].text}”
                                </span>
                            ) : m.repliedMsg?.content?.[0]?.type === "image" ? (
                                <span className="italic text-blue-300">🖼 Изображение</span>
                            ) : (
                                <span className="italic text-blue-300">📎 Файл</span>
                            )}
                        </div>

                        <button
                            onClick={m.cancelReply}
                            className="text-white opacity-70 hover:opacity-100 transition"
                            title="Отменить ответ"
                        >
                            ✕
                        </button>
                    </div>
                )}

                <div className="flex items-center gap-5">
                    <button
                        onClick={m.handleUploadClick}
                        className="p-2 rounded-lg hover:bg-foreground/50 transition"
                        title="Загрузить файл"
                    >
                        <Upload size={24} color="#fff" strokeWidth={1.75} />
                    </button>

                    <input
                        ref={m.fileInputRef}
                        type="file"
                        multiple
                        onChange={m.handleFileChange}
                        className="hidden"
                    />

                    <input
                        type="text"
                        className="flex-1 bg-foreground/40 hover:bg-foreground/50 text-white rounded-lg p-2 outline-none border border-white/30"
                        placeholder="Введите сообщение..."
                        value={m.inputValue}
                        onChange={m.handleInputChange}
                        onKeyDown={(e) => e.key === "Enter" && m.handleSend()}
                    />

                    <button
                        onClick={m.handleSend}
                        disabled={m.upload.loading}
                        className="bg-foreground/40 hover:bg-foreground/50 border border-white/30 text-white px-4 py-2 rounded-lg"
                    >
                        Отправить
                    </button>
                </div>
            </div>
        </>
    );
};
