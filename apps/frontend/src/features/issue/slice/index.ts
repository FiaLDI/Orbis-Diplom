import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {};

const issueSlice = createSlice({
    name: "issue",
    initialState,
    reducers: {
    },
});

export const {
} = issueSlice.actions;

export default issueSlice.reducer;
