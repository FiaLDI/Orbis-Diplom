import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserInfo, userState } from "../types";
import { userApi } from "../api";

const initialState: userState = {
    loadedProfiles: undefined,
    openProfile: {
        id: 0,
        username: "",
        avatar_url: "/img/icon.png",
        about: "",
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
        builder
            .addMatcher(userApi.endpoints.getInfoUser.matchFulfilled, (state, action) => {
                state.isOpenProfile = true;
                state.openProfile = action.payload.data;
                state.loadedProfiles?.push(action.payload);
            })
            .addMatcher(userApi.endpoints.GetChatsUsers.matchFulfilled, (state, action) => {
                state.chats = action.payload.data;
            });
    },
});

export const { setProfile, closeProfile } = userSlice.actions;

export default userSlice.reducer;
