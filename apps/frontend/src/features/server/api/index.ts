import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "@/config";

export const serverApi = createApi({
    reducerPath: "serverApi",
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
    tagTypes: ["Servers", "ServerMembers", "Roles"],
    endpoints: (builder) => ({
        GetServers: builder.query({
            query: () => ({
                url: `/servers`,
                method: "GET",
            }),
        }),
        CreateSever: builder.mutation({
            query: (data) => ({
                url: `/servers`,
                method: "POST",
                body: data,
            }),
        }),
        GetServersInside: builder.query({
            query: (id) => ({
                url: `/servers/${id}/`,
                method: "GET",
            }),
        }),
        CreateChat: builder.mutation({
            query: ({ id, data }) => ({
                url: `/servers/${id}/chats`,
                method: "POST",
                body: data,
            }),
        }),
        DeleteChat: builder.mutation({
            query: ({ id, chatId }) => ({
                url: `/servers/${id}/chats/${chatId}`,
                method: "DELETE",
            }),
        }),
        JoinServer: builder.mutation({
            query: (id) => ({
                url: `/servers/${id}/join`,
                method: "POST",
            }),
        }),
        GetServersMembers: builder.query({
            query: (id) => ({
                url: `/servers/${id}/members`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "ServerMembers", id }],
        }),
        GetServersRoles: builder.query({
            query: (id) => ({
                url: `/servers/${id}/roles`,
                method: "GET",
            }),
            transformResponse: (response: any) => response.data,
            providesTags: (result, error, id) =>
                result
                    ? [
                          ...result.map((role: any) => ({ type: "Roles" as const, id: role.id })),
                          { type: "Roles", id: "LIST" },
                      ]
                    : [{ type: "Roles", id: "LIST" }],
        }),
        GetPermissions: builder.query({
            query: () => ({
                url: `/servers/roles/permissions`,
                method: "GET",
            }),
            transformResponse: (response: any) => response.data,
        }),
        GetRolePermissions: builder.query({
            query: (roleId: number) => ({
                url: `/servers/roles/${roleId}/permissions`,
                method: "GET",
            }),
            transformResponse: (response: any) => response.data,
        }),
        UpdateRolePermissions: builder.mutation({
            query: ({ roleId, permissions }: { roleId: number; permissions: number[] }) => ({
                url: `/servers/roles/${roleId}/permissions`,
                method: "PATCH",
                body: { permissions },
            }),
        }),
        CreateRole: builder.mutation({
            query: ({ id, data }) => ({
                url: `/servers/${id}/roles`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: [{ type: "Roles", id: "LIST" }],
        }),
        UpdateServerRole: builder.mutation({
            query: ({ serverId, roleId, data }) => ({
                url: `/servers/${serverId}/roles/${roleId}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { serverId }) => [
                { type: "Roles", id: "LIST" },
                { type: "ServerMembers", id: serverId },
            ],
        }),
        deleteRole: builder.mutation<void, { serverId: number; roleId: number }>({
            query: ({ serverId, roleId }) => ({
                url: `/servers/${serverId}/roles/${roleId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { serverId }) => [
                { type: "Roles", id: "LIST" },
                { type: "ServerMembers", id: serverId },
            ],
        }),

        AssignRoleToMember: builder.mutation({
            query: ({ serverId, userId, roleId }) => ({
                url: `/servers/${serverId}/members/${userId}/roles/${roleId}`,
                method: "POST",
            }),
            invalidatesTags: (result, error, { serverId }) => [
                { type: "ServerMembers", id: serverId },
            ],
        }),

        RemoveRoleFromMember: builder.mutation({
            query: ({ serverId, userId, roleId }) => ({
                url: `/servers/${serverId}/members/${userId}/roles/${roleId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { serverId }) => [
                { type: "ServerMembers", id: serverId },
            ],
        }),

        GetServersChats: builder.query({
            query: (id) => ({
                url: `/servers/${id}/chats`,
                method: "GET",
            }),
            transformResponse: (response: any) => response.data,
        }),
    }),
});

export const {
    useGetServersQuery,
    useLazyGetServersQuery,
    useCreateSeverMutation,
    useLazyGetServersInsideQuery,
    useCreateChatMutation,
    useDeleteChatMutation,
    useJoinServerMutation,
    useLazyGetServersMembersQuery,
    useGetPermissionsQuery,
    useLazyGetPermissionsQuery,
    useGetRolePermissionsQuery,
    useLazyGetRolePermissionsQuery,
    useUpdateRolePermissionsMutation,
    useLazyGetServersRolesQuery,
    useUpdateServerRoleMutation,
    useCreateRoleMutation,
    useAssignRoleToMemberMutation,
    useRemoveRoleFromMemberMutation,
    useDeleteRoleMutation,
    useLazyGetServersChatsQuery
} = serverApi;
