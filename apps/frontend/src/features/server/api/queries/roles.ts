export interface CreateRoleArgs {
    id: string;
    data: any;
}

export interface UpdateRoleArgs {
    serverId: string;
    roleId: string;
    data: any;
}

export interface RoleIdArgs {
    serverId: string;
    roleId: string;
}

export interface UpdateRolePermissionsArgs {
    serverId: string;
    roleId: string;
    permissions: number[];
}

export const rolesQueries = {
    GetServersRoles: (id: string) => ({
        url: `/servers/${id}/roles`,
        method: "GET",
    }),

    CreateRole: ({ id, data }: CreateRoleArgs) => ({
        url: `/servers/${id}/roles`,
        method: "POST",
        body: data,
    }),

    UpdateServerRole: ({ serverId, roleId, data }: UpdateRoleArgs) => ({
        url: `/servers/${serverId}/roles/${roleId}`,
        method: "PATCH",
        body: data,
    }),

    DeleteRole: ({ serverId, roleId }: RoleIdArgs) => ({
        url: `/servers/${serverId}/roles/${roleId}`,
        method: "DELETE",
    }),

    GetRolePermissions: ({ serverId, roleId }: RoleIdArgs) => ({
        url: `/servers/${serverId}/roles/${roleId}/permissions`,
        method: "GET",
    }),

    UpdateRolePermissions: ({ serverId, roleId, permissions }: UpdateRolePermissionsArgs) => ({
        url: `/servers/${serverId}/roles/${roleId}/permissions`,
        method: "PATCH",
        body: { permissions },
    }),
};
