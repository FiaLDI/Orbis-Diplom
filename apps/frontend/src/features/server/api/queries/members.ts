export interface GetMembersArgs {
    id: string;
}

export interface MemberRoleArgs {
    serverId: string;
    userId: string;
    roleId: string;
}

export const membersQueries = {
    GetServersMembers: (id: string) => ({
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
