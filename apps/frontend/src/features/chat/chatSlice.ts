// features/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { messageApi } from "./api/chatApi";
import { Message } from "./types/chat.types";

export interface chat {
    id: number;
    username: string;
    name?: string;
    type: string;
    chat_id?: string;
    lastmessage: string;
    created_at: string;
    updated_at: string;
    avatar_url: string;
    users: string[];
    owner: number;
}

interface chatState {
    chat?: chat[];
    activeHistory?: Message[];
    activeChat?: chat | undefined;
    openMessage?: Message;
    uploadstate?: boolean;
    uploadedFiles?: {
        type: string;
        url: string;
    };
    editmode?: {
        enabled: boolean;
        messagesId: string;
        chatId: string;
    };
    reply?: string;
}

const initialState: chatState = {};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setActiveChat(state, action: PayloadAction<chat | undefined>) {
            state.activeChat = action.payload;
        },
        sendMessageVisual(state, action: PayloadAction<any>) {
            if (!state.activeHistory) return;
            state.activeHistory.push(action.payload);
        },
        setOpenMessage(state, action: PayloadAction<Message | undefined>) {
            state.openMessage = action.payload;
        },
        setUploadState(state, action: PayloadAction<boolean>) {
            state.uploadstate = action.payload;
        },
        setEditMode(
            state,
            action: PayloadAction<{
                enabled: boolean;
                messagesId: string;
                chatId: string;
            }>,
        ) {
            state.editmode = {
                enabled: action.payload.enabled,
                messagesId: action.payload.messagesId,
                chatId: action.payload.chatId,
            };
        },
        leaveEditMode(state) {
            state.editmode = undefined;
        },
        setReply(state, action: PayloadAction<string | undefined>) {
            state.reply = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                messageApi.endpoints.GetMessages.matchFulfilled,
                (state, { payload, meta }) => {
                    const offset = meta.arg.originalArgs.offset;
                    if (offset === 0) {
                        state.activeHistory = payload;
                    } else {
                        state.activeHistory = [
                            ...(payload || []),
                            ...(state.activeHistory || []),
                        ];
                    }
                },
            )
            .addMatcher(
                messageApi.endpoints.CreateMessages.matchFulfilled,
                (state, action) => {},
            );
    },
});

export const {
    setActiveChat,
    sendMessageVisual,
    setOpenMessage,
    setUploadState,
    setEditMode,
    leaveEditMode,
    setReply,
} = chatSlice.actions;

export default chatSlice.reducer;
