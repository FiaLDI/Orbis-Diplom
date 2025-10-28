import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { issueState } from "../types";
import { issueApi } from "../api";
import { findIssueById, flattenIssues } from "../utils";

const initialState: issueState = {
    project: [],
    issues: [],
    statuses: [],
    openProjectId: null,
    priorities: [],
    issueMode: false,
    openIssue: null,
    issueChat: null,
};

const issueSlice = createSlice({
    name: "issue",
    initialState,
    reducers: {
        setOpenProject(state, action: PayloadAction<number | null>) {
            state.openProjectId = action.payload;
        },
        setOpenIssue(state, action: PayloadAction<number | null>) {
            state.openIssue = action.payload;
        },
        toggleIssueMode(state) {
            state.issueMode = !state.issueMode;
        },
    },
    extraReducers(builder) {
        builder
            .addMatcher(issueApi.endpoints.getProject.matchFulfilled, (state, action) => {
                state.project = action.payload;
            })
            .addMatcher(issueApi.endpoints.getIssues.matchFulfilled, (state, action) => {
                const projectId = action.meta.arg.originalArgs;
                if (state.openProjectId === projectId) {
                    state.issues = action.payload;
                }
            })
            .addMatcher(issueApi.endpoints.getStatuses.matchFulfilled, (state, action) => {
                state.statuses = action.payload;
            })
            .addMatcher(issueApi.endpoints.getPriority.matchFulfilled, (state, action) => {
                state.priorities = action.payload;
            })
            .addMatcher(issueApi.endpoints.getChatIssue.matchFulfilled, (state, action) => {
                state.issueChat = action.payload;
            });
    },
});

export const selectIssueById = (state: { issue: issueState }, id: number) =>
    findIssueById(state.issue.issues, id);

export const selectAllIssues = (state: { issue: issueState }) => flattenIssues(state.issue.issues);

export const { setOpenProject, setOpenIssue, toggleIssueMode } = issueSlice.actions;

export default issueSlice.reducer;
