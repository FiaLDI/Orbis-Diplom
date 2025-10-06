// features/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserInfo, userState } from "./types/user";
import { userApi } from "./api/userApi";

const initialState: userState = {
    loadedProfiles: undefined,
    openProfile: {
        id: 0,
        username: "aaaaaa",
        avatar_url: "/img/icon.png",
        about: `
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
        Tempora ex error maxime quae aliquam temporibus modi repudiandae eligendi rerum voluptatibus et, 
        voluptates, velit totam dicta animi alias quibusdam dolorem! Dolorum!Lorem, ipsum dolor sit amet 
        consectetur adipisicing elit. Tempora ex error maxime quae aliquam temporibus modi repudiandae eligendi rerum 
        voluptatibus et, voluptates, velit totam dicta animi alias quibusdam dolorem! Dolorum!Lorem, ipsum dolor sit amet 
        consectetur adipisicing elit. Tempora ex error maxime quae aliquam temporibus modi repudiandae eligendi rerum 
        voluptatibus et, voluptates, velit totam dicta animi alias quibusdam dolorem! Dolorum!
        `,
    },
    isOpenProfile: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setProfile(state, action: PayloadAction<UserInfo[]>) {
            state.loadedProfiles = action.payload;
        },
        closeProfile(state) {
            state.isOpenProfile = false;
            state.openProfile = undefined;
        },
    },
    extraReducers: (builder) => {
        // Обработка состояний для регистрации и авторизации
        builder
            .addMatcher(
                userApi.endpoints.getInfoUser.matchFulfilled,
                (state, action) => {
                    state.isOpenProfile = true;
                    state.openProfile = action.payload;
                    state.loadedProfiles?.push(action.payload);
                },
            )
            .addMatcher(
                userApi.endpoints.GetChatsUsers.matchFulfilled,
                (state, action) => {
                    state.chats = action.payload;
                },
            )
    },
});

export const {
    setProfile,
    closeProfile,
} = userSlice.actions;

export default userSlice.reducer;
