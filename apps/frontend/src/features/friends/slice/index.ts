import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { friendsApi } from "../api";
import { friendState, ModeKeys } from "../types";

const initialState: friendState = {
    friends: [],
    friendsMode: "All",
};

const friendSlice = createSlice({
    name: "friends",
    initialState,
    reducers: {
        startSearch(state) {
            state.isSearchActive = true;
        },
        endSearch(state) {
            state.isSearchActive = false;
        },
        setFriendMode(state, action: PayloadAction<ModeKeys>) {
            state.friendsMode = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(friendsApi.endpoints.getFriend.matchFulfilled, (state, action) => {
                state.friends = action.payload.data;
            })
            .addMatcher(
                friendsApi.endpoints.getIncomingRequests.matchFulfilled,
                (state, action) => {
                    state.friends = action.payload.data;
                }
            )
            .addMatcher(
                friendsApi.endpoints.getOutcomingRequests.matchFulfilled,
                (state, action) => {
                    state.friends = action.payload.data;
                }
            );
    },
});

export const { startSearch, setFriendMode, endSearch } = friendSlice.actions;

export default friendSlice.reducer;
