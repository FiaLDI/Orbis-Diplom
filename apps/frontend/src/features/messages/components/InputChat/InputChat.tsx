import React, { useRef, useState, useEffect } from "react";
import {
    useCreateMessagesMutation,
    useEditMessageMutation,
    useLazyGetMessagesQuery,
} from "../../api/messageApi";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
    leaveEditMode,
    sendMessageVisual,
    setReply,
    setUploadState,
} from "../../messageSlice";
import FileUploader from "./FileUploader";
import { SendHorizontal } from "lucide-react";
import { InputChatProps } from "../../types/chat.types";

const InputChat: React.FC<InputChatProps> = ({ scrollToBottom }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const chat_id = useAppSelector((s) => s.chat.activeChat?.chat_id);
    const UserInfo = useAppSelector((s) => s.auth.user?.info);
    const activeChat = useAppSelector((s) => s.chat.activeChat);
    const isOpen = useAppSelector((s) => s.chat.openMessage);
    //const uploadedFiles = useAppSelector(s => s.upload);
    const [newMessage, setNewMessage] = useState("");
    const reply = useAppSelector((s) => s.chat.reply);

    const [editMessagee, seteditMessagee] = useState("");
    const [sendMessage, { data }] = useCreateMessagesMutation();
    const [getMessages] = useLazyGetMessagesQuery();
    const [editMessage] = useEditMessageMutation();
    const dispatch = useAppDispatch();
    const editMode = useAppSelector((s) => s.chat.editmode);

    const handleClick = () => {
        if (newMessage.trim().length === 0) return;

        const message = {
            id: chat_id,
            data: {
                content: { text: newMessage },
                reply_to_id: reply || null,
                username: UserInfo?.username,
                user_id: UserInfo?.id,
                chat_id: chat_id,
            },
        };

        dispatch(
            sendMessageVisual({
                id: Date.now(),
                content: [{ text: newMessage }],
                username: UserInfo?.username,
                user_id: UserInfo?.id,
                is_edited: false,
                timestamp: new Date().toLocaleTimeString(),
            }),
        );

        sendMessage(message);
        setNewMessage("");
        dispatch(setReply(undefined));
        inputRef.current?.focus();

        setTimeout(() => {
            scrollToBottom();
        }, 100);
    };

    const handleEditClick = () => {
        editMessage({
            chat_id: isOpen?.chat_id,
            id: isOpen?.id,
            content: editMessagee,
        });
        dispatch(leaveEditMode());
        seteditMessagee("");
    };

    const handleFileUploaded = (url: string) => {
        if (!chat_id || !UserInfo) return;
        const fileMessage = {
            id: chat_id,
            data: {
                content: { url },
                reply_to_id: null,
                username: UserInfo.username,
                user_id: UserInfo.id,
                chat_id: chat_id,
            },
        };

        dispatch(
            sendMessageVisual({
                id: Date.now(),
                content: [{ type: "url", text: url }],
                username: UserInfo.username,
                user_id: UserInfo.id,
                is_edited: false,
                timestamp: new Date().toLocaleTimeString(),
            }),
        );

        sendMessage(fileMessage);
    };

    useEffect(() => {
        if (activeChat) {
            setTimeout(() => {
                getMessages({ id: activeChat?.chat_id, offset: 0 });
            }, 6000);
        }
    }, [data]);

    return (
        <div className="bg-[#2040b6] flex justify-between items-center shrink-0">
            {editMode?.enabled && editMode.chatId == activeChat?.chat_id ? (
                <>
                    <input
                        type="text"
                        className="p-3 bg-transparent w-full border-b-0 outline-0 text-white "
                        value={editMessagee}
                        onChange={(e) => seteditMessagee(e.target.value)}
                        placeholder="Введите сообщение..."
                        onKeyPress={(e) =>
                            e.key === "Enter" && handleEditClick()
                        }
                    />
                    <button
                        onClick={handleEditClick}
                        className="p-2 hover:brightness-90 cursor-pointer"
                    >
                        <SendHorizontal
                            color="#fff"
                            strokeWidth={1.25}
                            size={40}
                        />
                    </button>
                </>
            ) : (
                <>
                    <input
                        ref={inputRef}
                        type="text"
                        className="p-3 bg-transparent w-full border-b-0 outline-0 text-white "
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Введите сообщение..."
                        onKeyPress={(e) => e.key === "Enter" && handleClick()}
                    />

                    <FileUploader onUploaded={handleFileUploaded} />

                    <button
                        onClick={handleClick}
                        className="p-2 hover:brightness-90 cursor-pointer"
                    >
                        <SendHorizontal
                            color="#fff"
                            strokeWidth={1.25}
                            size={40}
                        />
                    </button>
                </>
            )}
        </div>
    );
};

export default InputChat;
