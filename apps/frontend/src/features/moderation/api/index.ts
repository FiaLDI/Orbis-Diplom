import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "@/config";

export const moderationApi = createApi({
    reducerPath: "moderationApi",
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
    tagTypes: ["AuditLogs", "BannedUsers"],
    endpoints: (builder) => ({
        getAuditLogs: builder.query<any[], number>({
            query: (serverId) => `/servers/${serverId}/moderation/logs`,
            providesTags: [{ type: "AuditLogs", id: "LIST" }],
            transformResponse: (response: any) => response.data,
        }),

        getBannedUsers: builder.query<any[], number>({
            query: (serverId) => `/servers/${serverId}/moderation/bans`,
            providesTags: [{ type: "BannedUsers", id: "LIST" }],
            transformResponse: (response: any) => response.data,
        }),

        banUser: builder.mutation<void, { serverId: number; userId: number; reason?: string }>({
            query: ({ serverId, userId, reason }) => ({
                url: `/servers/${serverId}/moderation/bans/${userId}`,
                method: "POST",
                body: { reason },
            }),
            invalidatesTags: [
                { type: "AuditLogs", id: "LIST" },
                { type: "BannedUsers", id: "LIST" },
            ],
        }),

        unbanUser: builder.mutation<void, { serverId: number; userId: number }>({
            query: ({ serverId, userId }) => ({
                url: `/servers/${serverId}/moderation/bans/${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: [
                { type: "AuditLogs", id: "LIST" },
                { type: "BannedUsers", id: "LIST" },
            ],
        }),

        kickUser: builder.mutation<void, { serverId: number; userId: number }>({
            query: ({ serverId, userId }) => ({
                url: `/servers/${serverId}/moderation/kicks/${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "AuditLogs", id: "LIST" }],
        }),
    }),
});

export const {
    useGetAuditLogsQuery,
    useBanUserMutation,
    useUnbanUserMutation,
    useKickUserMutation,
    useGetBannedUsersQuery,
} = moderationApi;
