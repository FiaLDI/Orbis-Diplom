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
      const chatId = String(
        msg.chatId ?? (msg as any).chat_id ?? state.activeChat?.id ?? "",
      );
      if (!chatId) return;

      if (!state.histories[chatId]) state.histories[chatId] = [];

      if (!state.histories[chatId].some((m) => m.id === msg.id)) {
        state.histories[chatId].push(msg);
      }

      if (
        !state.activeHistory.some((m) => m.id === msg.id) &&
        (!state.activeChat?.id || String(state.activeChat.id) === chatId)
      ) {
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
      state.activeHistory = action.payload.slice();
    },

    setActiveChat(
      state,
      action: PayloadAction<{ id: string; name?: string } | undefined>,
    ) {
      state.activeChat = action.payload;
      if (action.payload?.id && state.histories[action.payload.id]) {
        state.activeHistory = [...state.histories[action.payload.id]];
      } else {
        state.activeHistory = [];
      }
    },

    updateMessageInHistory(state, action: PayloadAction<Message>) {
      const updated = action.payload;
      const chatId = String(
        (updated as any).chatId ?? (updated as any).chat_id ?? "",
      );

      const patch = (arr: Message[]) =>
        arr.map((m) => (m.id === updated.id ? updated : m));

      state.activeHistory = patch(state.activeHistory);
      if (chatId && state.histories[chatId])
        state.histories[chatId] = patch(state.histories[chatId]);
    },
  },

  extraReducers: (builder) => {
    builder.addMatcher(
      messageApi.endpoints.getMessages.matchFulfilled,
      (state, { payload, meta }) => {
        const { id, cursor } = meta.arg.originalArgs;
        if (!state.histories) state.histories = {};

        const newMessages: Message[] = (payload as any) || [];
        const existing: Message[] = state.histories[id] || [];

        if (!cursor) {
          state.histories[id] = newMessages;
        } else {
          const existingIds = new Set(existing.map((m: any) => m.id));
          const filtered = newMessages.filter(
            (m: any) => !existingIds.has(m.id),
          );
          state.histories[id] = [...filtered, ...existing];
        }

        state.activeHistory = state.histories[id].slice();
      },
    );
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
  updateMessageInHistory,
} = messagesSlice.actions;

export default messagesSlice.reducer;
