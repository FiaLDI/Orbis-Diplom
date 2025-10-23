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

            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["AuditLogs"],
    endpoints: (builder) => ({
        getAuditLogs: builder.query<any[], { serverId?: number }>({
            query: ({ serverId }) =>
                serverId ? `/moderation/${serverId}/logs` : `/moderation/logs`,
            providesTags: (r) => (r ? [{ type: "AuditLogs", id: "LIST" }] : []),
        }),

        // Модерация
        banUser: builder.mutation<void, { serverId: number; userId: number; reason?: string }>({
            query: ({ serverId, userId, reason }) => ({
                url: `/moderation/servers/${serverId}/ban/${userId}`,
                method: "POST",
                body: { reason },
            }),
            invalidatesTags: [{ type: "AuditLogs", id: "LIST" }],
        }),

        unbanUser: builder.mutation<void, { serverId: number; userId: number }>({
            query: ({ serverId, userId }) => ({
                url: `/moderation/servers/${serverId}/ban/${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "AuditLogs", id: "LIST" }],
        }),

        kickUser: builder.mutation<void, { serverId: number; userId: number }>({
            query: ({ serverId, userId }) => ({
                url: `/moderation/servers/${serverId}/kick/${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "AuditLogs", id: "LIST" }],
        }),
        getBannedUsers: builder.query<any[], number>({
            query: (serverId) => `/moderation/servers/${serverId}/banned`,
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
