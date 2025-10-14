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
            }; // Type assertion for state
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
        }),
        GetRolePermissions: builder.query({
            query: (roleId: number) => ({
                url: `/servers/roles/${roleId}/permissions`,
                method: "GET",
            }),
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
            invalidatesTags: (res, err, { roleId }) => [{ type: "Roles", id: roleId }],
        }),
        DeleteRole: builder.mutation({
            query: ({ serverId, roleId }) => ({
            url: `/servers/${serverId}/roles/${roleId}`,
            method: "DELETE",
            }),
            invalidatesTags: [{ type: "Roles", id: "LIST" }],
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
    }),
});

export const {
    useGetServersQuery,
    useLazyGetServersQuery,
    useCreateSeverMutation,
    useLazyGetServersInsideQuery,
    useCreateChatMutation,
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
  useGetServersRolesQuery,
} = serverApi;
