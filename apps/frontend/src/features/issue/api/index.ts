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
            if (token) headers.set("authorization", `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ["Projects", "Issues", "Statuses", "Priorities", "Chat"],
    endpoints: (builder) => ({
        getProject: builder.query({
            query: (serverId: string) => `/servers/${serverId}/projects`,
            providesTags: (result, error, serverId) => [{ type: "Projects", id: serverId }],
            transformResponse: (response: any) => response.data,
        }),
        createProject: builder.mutation({
            query: ({ serverId, data }) => ({
                url: `/servers/${serverId}/projects`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { serverId }) => [{ type: "Projects", id: serverId }],
        }),
        updateProject: builder.mutation({
            query: ({ serverId, projectId, data }) => ({
                url: `/servers/${serverId}/projects/${projectId}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { serverId }) => [{ type: "Projects", id: serverId }],
        }),
        deleteProject: builder.mutation<void, { serverId: string; projectId: string }>({
            query: ({ serverId, projectId }) => ({
                url: `/servers/${serverId}/projects/${projectId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { serverId }) => [{ type: "Projects", id: serverId }],
        }),

        getIssues: builder.query<any[], { serverId: string; projectId: string }>({
            query: ({ serverId, projectId }) => `/servers/${serverId}/projects/${projectId}/issues`,
            providesTags: (result, error, { projectId }) =>
                result
                    ? [
                          ...result.map((issue) => ({
                              type: "Issues" as const,
                              id: issue.id,
                          })),
                          { type: "Issues", id: `PROJECT-${projectId}` },
                      ]
                    : [{ type: "Issues", id: `PROJECT-${projectId}` }],
            transformResponse: (response: any) => response.data,
        }),
        createIssue: builder.mutation({
            query: ({ serverId, projectId, data }) => ({
                url: `/servers/${serverId}/projects/${projectId}/issues`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: "Issues", id: `PROJECT-${projectId}` },
            ],
        }),
        updateIssue: builder.mutation({
            query: ({ serverId, projectId, issueId, data }) => ({
                url: `/servers/${serverId}/issues/${issueId}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { projectId, issueId }) => [
                { type: "Issues", id: issueId },
                { type: "Issues", id: `PROJECT-${projectId}` },
            ],
        }),
        deleteIssue: builder.mutation({
            query: ({ serverId, projectId, issueId }) => ({
                url: `/servers/${serverId}/issues/${issueId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { projectId, issueId }) => [
                { type: "Issues", id: issueId },
                { type: "Issues", id: `PROJECT-${projectId}` },
            ],
        }),
        assignUserToIssue: builder.mutation({
            query: ({ serverId, issueId, userId }) => ({
                url: `/servers/${serverId}/issues/${issueId}/assignees/${userId}`,
                method: "POST",
            }),
        }),
        unassignUserFromIssue: builder.mutation({
            query: ({ serverId, issueId, userId }) => ({
                url: `/servers/${serverId}/issues/${issueId}/assignees/${userId}`,
                method: "DELETE",
            }),
        }),

        getStatuses: builder.query({
            query: (serverId) => `/servers/${serverId}/issues/statuses`,
            providesTags: [{ type: "Statuses", id: "LIST" }],
            transformResponse: (response: any) => response.data,
        }),
        getPriority: builder.query({
            query: (serverId) => `/servers/${serverId}/issues/priorities`,
            providesTags: [{ type: "Priorities", id: "LIST" }],
            transformResponse: (response: any) => response.data,
        }),

        getChatIssue: builder.query({
            query: ({ serverId, issueId }) => `/servers/${serverId}/issues/${issueId}/chats`,
            transformResponse: (response: any) => response.data,
            providesTags: (result, error, { issueId }) =>
                result
                    ? [
                          ...result.map(({ id }: any) => ({ type: "Chat" as const, id })),
                          { type: "Chat", id: `Issue-${issueId}` },
                      ]
                    : [{ type: "Chat", id: `Issue-${issueId}` }],
        }),

        createChatIssue: builder.mutation({
            query: ({ serverId, issueId, data }) => ({
                url: `/servers/${serverId}/issues/${issueId}/chats`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { issueId }) => [
                { type: "Chat", id: `Issue-${issueId}` },
            ],
        }),

        updateChatIssue: builder.mutation({
            query: ({ serverId, issueId, chatId, data }) => ({
                url: `/servers/${serverId}/issues/${issueId}/chats/${chatId}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { issueId, chatId }) => [
                { type: "Chat", id: chatId },
                { type: "Chat", id: `Issue-${issueId}` },
            ],
        }),

        deleteChatIssue: builder.mutation({
            query: ({ serverId, issueId, chatId }) => ({
                url: `/servers/${serverId}/issues/${issueId}/chats/${chatId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { issueId, chatId }) => [
                { type: "Chat", id: chatId },
                { type: "Chat", id: `Issue-${issueId}` },
            ],
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

    useAssignUserToIssueMutation,
    useUnassignUserFromIssueMutation,

    useLazyGetStatusesQuery,
    useLazyGetPriorityQuery,

    useLazyGetChatIssueQuery,
    useCreateChatIssueMutation,
    useUpdateChatIssueMutation,
    useDeleteChatIssueMutation,
} = issueApi;
