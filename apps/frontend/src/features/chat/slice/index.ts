import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { chat, chatState } from "../types";


const initialState: chatState = {};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setActiveChat(state, action: PayloadAction<chat | undefined>) {
            state.activeChat = action.payload;
        },
    },
});

export const {
    setActiveChat,
} = chatSlice.actions;

export default chatSlice.reducer;
