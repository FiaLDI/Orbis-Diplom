import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "@/config";
import { serversQueries } from "./queries/servers";
import { chatsQueries } from "./queries/chats";
import { membersQueries } from "./queries/members";
import { rolesQueries } from "./queries/roles";
import { permissionsQueries } from "./queries/permissions";

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
            query: serversQueries.GetServers,
        }),
        CreateSever: builder.mutation({
            query: serversQueries.CreateServer,
        }),
        DeleteServer: builder.mutation({
            query: serversQueries.DeleteServer,
        }),
        GetServersInside: builder.query({
            query: serversQueries.GetServersInside,
        }),
        JoinServer: builder.mutation({
            query: serversQueries.JoinServer,
        }),
        UpdateServer: builder.mutation({
            query: serversQueries.UpdateServer,
        }),

        GetServersMembers: builder.query({
            query: membersQueries.GetServersMembers,
            providesTags: (result, error, id) => [{ type: "ServerMembers", id }],
        }),
        AssignRoleToMember: builder.mutation({
            query: membersQueries.AssignRoleToMember,
            invalidatesTags: (result, error, { serverId }) => [
                { type: "ServerMembers", id: serverId },
            ],
        }),
        RemoveRoleFromMember: builder.mutation({
            query: membersQueries.RemoveRoleFromMember,
            invalidatesTags: (result, error, { serverId }) => [
                { type: "ServerMembers", id: serverId },
            ],
        }),
        GetServersRoles: builder.query({
            query: rolesQueries.GetServersRoles,
            transformResponse: (r: any) => r.data,
            providesTags: (result, error, id) =>
                result
                    ? [
                          ...result.map((role: any) => ({ type: "Roles" as const, id: role.id })),
                          { type: "Roles", id: "LIST" },
                      ]
                    : [{ type: "Roles", id: "LIST" }],
        }),
        CreateRole: builder.mutation({
            query: rolesQueries.CreateRole,
            invalidatesTags: [{ type: "Roles", id: "LIST" }],
        }),
        UpdateServerRole: builder.mutation({
            query: rolesQueries.UpdateServerRole,
            invalidatesTags: (result, error, { serverId }) => [
                { type: "Roles", id: "LIST" },
                { type: "ServerMembers", id: serverId },
            ],
        }),
        DeleteRole: builder.mutation({
            query: rolesQueries.DeleteRole,
            invalidatesTags: (result, error, { serverId }) => [
                { type: "Roles", id: "LIST" },
                { type: "ServerMembers", id: serverId },
            ],
        }),

        GetRolePermissions: builder.query({
            query: rolesQueries.GetRolePermissions,
            transformResponse: (r: any) => r.data,
        }),
        UpdateRolePermissions: builder.mutation({
            query: rolesQueries.UpdateRolePermissions,
        }),
        GetPermissions: builder.query({
            query: permissionsQueries.GetPermissions,
            transformResponse: (r: any) => r.data,
        }),

        CreateChat: builder.mutation({
            query: chatsQueries.CreateChat,
        }),
        DeleteChat: builder.mutation({
            query: chatsQueries.DeleteChat,
        }),
        GetServersChats: builder.query({
            query: chatsQueries.GetServersChats,
            transformResponse: (r: any) => r.data,
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
    useLazyGetServersChatsQuery,
    useUpdateServerMutation,
    useDeleteServerMutation
} = serverApi;
