import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/slice";
import chatReducer from "@/features/chat/slice";
import messageReducer from "@/features/messages/slice";
import serverReducer from "@/features/server/slice";
import userReducer from "@/features/user/slice";
import uploadReducer from "@/features/upload/slice";
import notificationReducer from "@/features/notification/slice";
import settingsReducer from "@/features/settings";
import friendsReducer from "@/features/friends/slice";
import issueReducer from "@/features/issue/slice";
import toastReducer from "@/features/toast/slice";
import { serverApi } from "@/features/server";
import { authApi } from "@/features/auth";
import { userApi } from "@/features/user";
import { friendsApi } from "@/features/friends";
import { messageApi } from "@/features/messages";
import { chatApi } from "@/features/chat";
import { issueApi } from "@/features/issue";
import { settingsApi } from "@/features/settings";
import { notificationApi } from "@/features/notification";
import { moderationApi } from "@/features/moderation";

import { toastMiddleware } from "@/features/toast";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        message: messageReducer,
        server: serverReducer,
        user: userReducer,
        upload: uploadReducer,
        notification: notificationReducer,
        settings: settingsReducer,
        friends: friendsReducer,
        issue: issueReducer,
        toast: toastReducer,
        [authApi.reducerPath]: authApi.reducer,
        [messageApi.reducerPath]: messageApi.reducer,
        [chatApi.reducerPath]: chatApi.reducer,
        [serverApi.reducerPath]: serverApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [friendsApi.reducerPath]: friendsApi.reducer,
        [issueApi.reducerPath]: issueApi.reducer,
        [settingsApi.reducerPath]: settingsApi.reducer,
        [notificationApi.reducerPath]: notificationApi.reducer,
        [moderationApi.reducerPath]: moderationApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            toastMiddleware,
            authApi.middleware,
            messageApi.middleware,
            chatApi.middleware,
            serverApi.middleware,
            userApi.middleware,
            friendsApi.middleware,
            issueApi.middleware,
            settingsApi.middleware,
            notificationApi.middleware,
            moderationApi.middleware
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
