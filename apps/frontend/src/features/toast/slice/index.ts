import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import { Toast, ToastPosition, ToastState, ToastType } from "../types";

// 🔹 Возможные позиции

const initialState: ToastState = {
    toasts: [],
    position: "top-right",
};

const toastSlice = createSlice({
    name: "toast",
    initialState,
    reducers: {
        addToast: {
            reducer(state, action: PayloadAction<Toast>) {
                state.toasts.unshift(action.payload);
            },
            prepare(message: string, type: ToastType = "info", duration = 2000) {
                return {
                    payload: {
                        id: nanoid(),
                        message,
                        type,
                        duration,
                    },
                };
            },
        },

        removeToast(state, action: PayloadAction<string>) {
            state.toasts = state.toasts.filter((t) => t.id !== action.payload);
        },

        clearAllToasts(state) {
            state.toasts = [];
        },

        // 🔧 Управление позицией контейнера
        setToastPosition(state, action: PayloadAction<ToastPosition>) {
            state.position = action.payload;
        },
    },
});

export const { addToast, removeToast, clearAllToasts, setToastPosition } = toastSlice.actions;

export const selectToasts = (state: RootState) => state.toast.toasts;
export const selectToastPosition = (state: RootState) => state.toast.position;

export default toastSlice.reducer;
