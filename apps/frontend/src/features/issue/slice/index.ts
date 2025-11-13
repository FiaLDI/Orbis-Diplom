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
};

const issueSlice = createSlice({
  name: "issue",
  initialState,
  reducers: {
    setOpenProject(state, action: PayloadAction<string | null>) {
      state.openProjectId = action.payload;
    },
    setOpenIssue(state, action: PayloadAction<string | null>) {
      state.openIssue = action.payload;
    },
    toggleIssueMode(state) {
      state.issueMode = !state.issueMode;
    },
    setChatName(state, action: PayloadAction<{ id: string; name: string }>) {
      const chat = state.issues?.chats?.find(
        (c: any) => c.id === action.payload.id,
      );
      if (chat) {
        chat.name = action.payload.name;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(
        issueApi.endpoints.getProject.matchFulfilled,
        (state, action) => {
          state.project = action.payload;
        },
      )
      .addMatcher(
        issueApi.endpoints.getIssues.matchFulfilled,
        (state, action) => {
          const projectId = action.meta.arg.originalArgs;
          if (state.openProjectId === projectId.projectId) {
            state.issues = action.payload;
          }
        },
      )
      .addMatcher(
        issueApi.endpoints.getStatuses.matchFulfilled,
        (state, action) => {
          state.statuses = action.payload;
        },
      )
      .addMatcher(
        issueApi.endpoints.getPriority.matchFulfilled,
        (state, action) => {
          state.priorities = action.payload;
        },
      )
      .addMatcher(
        issueApi.endpoints.getChatIssue.matchFulfilled,
        (state, action) => {
          const { issueId } = action.meta.arg.originalArgs;

          const issue = state.issues?.find((c: any) => c.id === issueId);

          if (!issue) {
            console.warn(
              `⚠️ issue ${issueId} не найден в state.issues`,
              state.issues,
            );
            return;
          }

          issue.chats = action.payload;
        },
      );
  },
});

export const selectIssueById = (state: { issue: issueState }, id: string) =>
  findIssueById(state.issue.issues, id);

export const selectAllIssues = (state: { issue: issueState }) =>
  flattenIssues(state.issue.issues);

export const { setOpenProject, setOpenIssue, toggleIssueMode, setChatName } =
  issueSlice.actions;

export default issueSlice.reducer;
