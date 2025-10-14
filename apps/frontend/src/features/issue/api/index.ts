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
        getProject: builder.query({
            query: (id) => ({
                url: `/servers/${id}/projects`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Projects", id }],
        }),
        createProject: builder.mutation({
            query: ({id, data}) => ({
                url: `/servers/${id}/projects`,
                method: "POST",
                body: {...data},
            }),
            invalidatesTags: (result, error, { serverId }) => [
                { type: "Projects", id: serverId },
            ],
        }),
        UpdateProject: builder.mutation({
            query: ({ serverId, projectId, data }) => ({
                url: `/servers/${serverId}/projects/${projectId}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { serverId }) => [
                { type: "Projects", id: serverId },
            ],
        }),
        deleteProject: builder.mutation<void, { serverId: number; projectId: number }>({
            query: ({ serverId, projectId }) => ({
                url: `/servers/${serverId}/projects/${projectId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { serverId }) => [
                { type: "Projects", id: serverId },
            ],
        }),
        getIssues: builder.query({
            query: (id) => ({
                url: `/servers/projects/${id}/issues`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Issues", id }],
        }),
        createIssue: builder.mutation({
            query: ({id, data}) => ({
                url: `/servers/projects/${id}/issues`,
                method: "POST",
                body: {...data},
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Issues", id },
            ],
        }),
        
        deleteIssue: builder.mutation({
            query: ({ issueId }) => ({
                url: `/servers/issues/${issueId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { issueId }) => [
                { type: "Projects", id: issueId },
            ],
        }),
        getStatuses: builder.query({
            query: () => ({
                url: `/servers/issues/statuses`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Statuses", id }],
        }),
        getPriority: builder.query({
            query: () => ({
                url: `/servers/issues/priorities`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Priorities", id }],
        }),
    }),
});

export const {
    useLazyGetProjectQuery,
    useCreateProjectMutation,
    useDeleteProjectMutation,
    useUpdateProjectMutation,
    useCreateIssueMutation,
    useLazyGetStatusesQuery,
    useLazyGetPriorityQuery,
    useLazyGetIssuesQuery,
    useDeleteIssueMutation
} = issueApi;
