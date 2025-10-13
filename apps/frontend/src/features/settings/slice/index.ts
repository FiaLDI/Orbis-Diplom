import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AccountInfo, Language, ProfileInfo, settingsState, Theme } from "../types";

const initialState: settingsState = {
    theme: "standart",
    language: "ru",
    notification: false,
    accountInfoUpdated: {},
    profileInfoUpdated: {},
};

const userSettingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload
        },
        setLanguage: (state, action: PayloadAction<Language>) => {
            state.language = action.payload
        },
        setNotification: (state, action: PayloadAction<boolean>) => {
            state.notification = action.payload
        },
        setAccountInfo: (state, action: PayloadAction<Partial<AccountInfo>>) => {
            state.accountInfoUpdated = {
                ...state.accountInfoUpdated,
                ...action.payload,
            };
        },
        setProfileInfo: (state, action: PayloadAction<Partial<ProfileInfo>>) => {
            state.profileInfoUpdated = {
                ...state.profileInfoUpdated,
                ...action.payload,
            };
        },
    },
    extraReducers: (builder) => {
        
    },
});

export const {
    setAccountInfo,
    setProfileInfo,
    setTheme,
    setLanguage,
    setNotification
} = userSettingsSlice.actions;

export default userSettingsSlice.reducer;
