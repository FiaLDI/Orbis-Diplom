import { configureStore } from "@reduxjs/toolkit";
import { messageApi } from "../features/chat/api/chatApi";
import authReducer from "../features/auth/authSlice";
import messageReducer from "../features/chat/chatSlice";
import serverReducer from "../features/server/serverSlices";
import userReducer from "../features/user/userSlices";
import uploadReducer from '../features/upload/uploadSlice';
import actionReducer from '../features/action/actionSlice';
import  userSettingsReducer from "../features/usersettings/userSettingsSlice";
import { serverApi } from "../features/server/api/serverApi";
import { authApi } from "@/features/auth";
import { userApi } from "@/features/user";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: messageReducer,
        server: serverReducer,
        user: userReducer,
        upload: uploadReducer,
        action: actionReducer,
        usersettings: userSettingsReducer,
        [authApi.reducerPath]: authApi.reducer,
        [messageApi.reducerPath]: messageApi.reducer,
        [serverApi.reducerPath]: serverApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            messageApi.middleware,
            serverApi.middleware,
            userApi.middleware,
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
