import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { chat, chatState } from "../types";
import { chatApi } from "..";

const initialState: chatState = {};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setActiveChat(state, action: PayloadAction<chat | undefined>) {
            state.activeChat = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            chatApi.endpoints.updateChat.matchFulfilled,
            (state: any, action: any) => {
                state.activeChat = {
                    ...state.activeChat,
                    name: action.payload.name,
                };
            }
        );
    },
});

export const { setActiveChat } = chatSlice.actions;

export default chatSlice.reducer;
