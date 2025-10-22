import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "@/config";

export const issueApi = createApi({
    reducerPath: "issueApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${config.monoliteUrl}/api`,
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            const state = getState() as {
                auth: { user: { access_token?: string } };
            };
            const token = state.auth.user?.access_token;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Projects", "Issues", "Statuses", "Priorities"],
    endpoints: (builder) => ({
        /* 🔹 Projects */
        getProject: builder.query({
            query: (id) => `/servers/${id}/projects`,
            providesTags: (result, error, id) => [{ type: "Projects", id }],
        }),

        createProject: builder.mutation({
            query: ({ id, data }) => ({
                url: `/servers/${id}/projects`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Projects", id }],
        }),

        updateProject: builder.mutation({
            query: ({ serverId, projectId, data }) => ({
                url: `/servers/${serverId}/projects/${projectId}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { serverId }) => [{ type: "Projects", id: serverId }],
        }),

        deleteProject: builder.mutation<void, { serverId: number; projectId: number }>({
            query: ({ serverId, projectId }) => ({
                url: `/servers/${serverId}/projects/${projectId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { serverId }) => [{ type: "Projects", id: serverId }],
        }),

        /* 🔹 Issues */
        getIssues: builder.query<any[], number>({
            query: (projectId) => `/servers/projects/${projectId}/issues`,
            providesTags: (result, error, projectId) =>
                result
                    ? [
                          ...result.map((issue) => ({ type: "Issues" as const, id: issue.id })),
                          { type: "Issues", id: `PROJECT-${projectId}` },
                      ]
                    : [{ type: "Issues", id: `PROJECT-${projectId}` }],
        }),

        createIssue: builder.mutation({
            query: ({ projectId, data }) => ({
                url: `/servers/projects/${projectId}/issues`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: "Issues", id: `PROJECT-${projectId}` },
            ],
        }),

        updateIssue: builder.mutation({
            query: ({ projectId, issueId, data }) => ({
                url: `/servers/issues/${issueId}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { projectId, issueId }) => [
                { type: "Issues", id: issueId },
                { type: "Issues", id: `PROJECT-${projectId}` },
            ],
        }),

        deleteIssue: builder.mutation({
            query: ({ projectId, issueId }) => ({
                url: `/servers/issues/${issueId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { projectId, issueId }) => [
                { type: "Issues", id: issueId },
                { type: "Issues", id: `PROJECT-${projectId}` },
            ],
        }),
        assignUserToIssue: builder.mutation<void, { issueId: number; userId: number }>({
            query: ({ issueId, userId }) => ({
                url: `/servers/issues/${issueId}/assignees/${userId}`,
                method: "POST",
            }),
        }),
        unassignUserFromIssue: builder.mutation<void, { issueId: number; userId: number }>({
            query: ({ issueId, userId }) => ({
                url: `/servers/issues/${issueId}/assignees/${userId}`,
                method: "DELETE",
            }),
        }),

        /* 🔹 Meta */
        getStatuses: builder.query({
            query: () => `/servers/issues/statuses`,
            providesTags: [{ type: "Statuses", id: "LIST" }],
        }),

        getPriority: builder.query({
            query: () => `/servers/issues/priorities`,
            providesTags: [{ type: "Priorities", id: "LIST" }],
        }),

        /* Chats /issues/:id/chats*/
        getChatIssue: builder.query({
            query: (id) => `/servers/issues/${id}/chats`,
        }),

        createChatIssue: builder.mutation({
            query: ({ issueId, data }) => ({
                url: `/servers/issues/${issueId}/chats`,
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const {
    useLazyGetProjectQuery,
    useCreateProjectMutation,
    useDeleteProjectMutation,
    useUpdateProjectMutation,

    useLazyGetIssuesQuery,
    useCreateIssueMutation,
    useUpdateIssueMutation,
    useDeleteIssueMutation,
    useLazyGetChatIssueQuery,
    useCreateChatIssueMutation,
    useAssignUserToIssueMutation,
    useUnassignUserFromIssueMutation,

    useLazyGetStatusesQuery,
    useLazyGetPriorityQuery,
} = issueApi;
