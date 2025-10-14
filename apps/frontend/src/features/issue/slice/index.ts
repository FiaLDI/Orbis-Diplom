import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { issueState } from "../types";
import { issueApi } from "../api";

const initialState: issueState = {
    project: [],
    issues: [],
    statuses: [],
    openProjectId: null,
    priorities: []
};

const issueSlice = createSlice({
    name: "issue",
    initialState,
    reducers: {
        setOpenProject(state, action: PayloadAction<number | null>) {
            state.openProjectId = action.payload;
        }
    },
    extraReducers(builder) {
        builder
            .addMatcher(
                issueApi.endpoints.getProject.matchFulfilled,
                (state, action) => {
                    state.project = action.payload
                },
            )
            .addMatcher(
                issueApi.endpoints.getIssues.matchFulfilled,
                (state, action) => {
                    if(!state.openProjectId) return;
                    state.issues = action.payload
                },
            )
            .addMatcher(
                issueApi.endpoints.getStatuses.matchFulfilled,
                (state, action) => {
                    state.statuses = action.payload;
                }
            )
            .addMatcher(
                issueApi.endpoints.getPriority.matchFulfilled,
                (state, action) => {
                    state.priorities = action.payload;
                }
            )
    },
});

export const {
    setOpenProject
} = issueSlice.actions;

export default issueSlice.reducer;
