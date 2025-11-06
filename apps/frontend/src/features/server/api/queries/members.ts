export interface GetMembersArgs {
    id: number;
}

export interface MemberRoleArgs {
    serverId: number;
    userId: number;
    roleId: number;
}

export const membersQueries = {
    GetServersMembers: (id: number) => ({
        url: `/servers/${id}/members`,
        method: "GET",
    }),

    AssignRoleToMember: ({ serverId, userId, roleId }: MemberRoleArgs) => ({
        url: `/servers/${serverId}/members/${userId}/roles/${roleId}`,
        method: "POST",
    }),

    RemoveRoleFromMember: ({ serverId, userId, roleId }: MemberRoleArgs) => ({
        url: `/servers/${serverId}/members/${userId}/roles/${roleId}`,
        method: "DELETE",
    }),
};
