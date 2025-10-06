import { configureStore } from "@reduxjs/toolkit";
import { messageApi } from "../features/chat/api/chatApi";
import authReducer from "../features/auth/authSlice";
import messageReducer from "../features/chat/chatSlice";
import serverReducer from "../features/server/serverSlices";
import userReducer from "../features/user/userSlices";
import uploadReducer from "../features/upload/uploadSlice";
import actionReducer from "../features/action/actionSlice";
import userSettingsReducer from "../features/usersettings/userSettingsSlice";
import friendsReducer from "../features/friends/friendsSlice";
import { serverApi } from "../features/server/api/serverApi";
import { authApi } from "@/features/auth";
import { userApi } from "@/features/user";
import { friendsApi } from "@/features/friends";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: messageReducer,
        server: serverReducer,
        user: userReducer,
        upload: uploadReducer,
        action: actionReducer,
        usersettings: userSettingsReducer,
        friends: friendsReducer,
        [authApi.reducerPath]: authApi.reducer,
        [messageApi.reducerPath]: messageApi.reducer,
        [serverApi.reducerPath]: serverApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [friendsApi.reducerPath]: friendsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            messageApi.middleware,
            serverApi.middleware,
            userApi.middleware,
            friendsApi.middleware,
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
