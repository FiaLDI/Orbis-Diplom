// features/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { messageApi } from "./api/messageApi";
import { Message, messageSliceState } from "./types/chat.types";

const initialState: messageSliceState = {};

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
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
  messageApi.endpoints.getMessages.matchFulfilled,
  (state, { payload, meta }) => {
    console.log('✅ Messages payload:', payload);
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

    },
});

export const {
    sendMessageVisual,
    setOpenMessage,
    setUploadState,
    setEditMode,
    leaveEditMode,
    setReply,
} = messagesSlice.actions;

export default messagesSlice.reducer;
