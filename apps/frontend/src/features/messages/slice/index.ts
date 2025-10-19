import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { messageApi } from "../api";
import { Message, messageSliceState } from "../types";

const initialState: messageSliceState = {
  activeHistory: [],
  histories: {},
  openMessage: undefined,
  uploadstate: false,
  editmode: undefined,
  reply: undefined,
  activeChat: undefined,
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {

    setOpenMessage(state, action: PayloadAction<Message | undefined>) {
      state.openMessage = action.payload;
    },

    setUploadState(state, action: PayloadAction<boolean>) {
      state.uploadstate = action.payload;
    },

    addMessage(state, action: PayloadAction<Message>) {
        const msg = action.payload;
        if (!state.activeHistory.some((m) => m.id === msg.id)) {
            state.activeHistory.push(msg);
        }
        },


    setEditMode(state, action) {
      state.editmode = action.payload;
    },

    leaveEditMode(state) {
      state.editmode = undefined;
    },

    setReply(state, action: PayloadAction<string | undefined>) {
      state.reply = action.payload;
    },

    clearActiveHistory(state) {
      state.activeHistory = [];
    },

    setActiveHistory(state, action: PayloadAction<Message[]>) {
        state.activeHistory = action.payload;
    },

    setActiveChat(state, action: PayloadAction<{ id: string; name?: string } | undefined>) {
      state.activeChat = action.payload;
      if (action.payload?.id && state.histories[action.payload.id]) {
        state.activeHistory = state.histories[action.payload.id];
      } else {
        state.activeHistory = [];
      }
    },

    updateMessageInHistory: (state, action: PayloadAction<Message>) => {
      const updated = action.payload;
      const chatId = String(updated.chat_id);

      // Обновляем активную историю (если открыта)
      state.activeHistory = state.activeHistory.map((msg) =>
        msg.id === updated.id ? updated : msg,
      );

      // Обновляем кеш истории чата (если сохранён)
      if (state.histories[chatId]) {
        state.histories[chatId] = state.histories[chatId].map((msg) =>
          msg.id === updated.id ? updated : msg,
        );
      }
    }
  },

  extraReducers: (builder) => {
    builder.addMatcher(
      messageApi.endpoints.getMessages.matchFulfilled,
      (state, { payload, meta }) => {
        const { id, offset } = meta.arg.originalArgs;

        if (!state.histories) state.histories = {};

        if (offset === 0) {
          state.histories[id] = payload;
        } else {
          state.histories[id] = [
            ...(payload || []),
            ...(state.histories[id] || []),
          ];
        }

        state.activeHistory = state.histories[id];
      }
    )
  },
});

export const {
  setOpenMessage,
  setUploadState,
  addMessage,
  setActiveHistory,
  setEditMode,
  leaveEditMode,
  setReply,
  clearActiveHistory,
  setActiveChat,
  updateMessageInHistory
} = messagesSlice.actions;

export default messagesSlice.reducer;
