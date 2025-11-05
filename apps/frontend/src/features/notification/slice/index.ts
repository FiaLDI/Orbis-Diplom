import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationState, Notification } from "../types";
import { notificationApi } from "../api";

const initialState: NotificationState = {
    list: [],
    onlineUsers: [],
};

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotifications(state, action: PayloadAction<Notification[]>) {
            state.list = action.payload;
        },
        addNotification(state, action: PayloadAction<Notification>) {
            state.list.unshift(action.payload);
        },
        markAsRead(state, action: PayloadAction<number>) {
            const notif = state.list.find((n) => n.id === action.payload);
            if (notif) notif.is_read = true;
        },
        removeNotification(state, action: PayloadAction<number>) {
            state.list = state.list.filter((n) => n.id !== action.payload);
        },
        clearNotifications(state) {
            state.list = [];
        },
        userOnline(state, action: PayloadAction<number>) {
            const id = action.payload;
            if (!state.onlineUsers.includes(id)) {
                state.onlineUsers.push(id);
            }
        },
        userOffline(state, action: PayloadAction<number>) {
            state.onlineUsers = state.onlineUsers.filter((userId) => userId !== action.payload);
        },
        setOnlineUsers(state, action: PayloadAction<number[]>) {
            state.onlineUsers = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder.addMatcher(
            notificationApi.endpoints.getNotifications.matchFulfilled,
            (state, action) => {
                console.log(action);
                state.list = (action.payload as any).data;
            }
        );
    },
});

export const {
    setNotifications,
    addNotification,
    markAsRead,
    removeNotification,
    clearNotifications,
    userOnline,
    userOffline,
    setOnlineUsers,
} = notificationSlice.actions;

export default notificationSlice.reducer;
