export interface CreateRoleArgs {
    id: number;
    data: any;
}

export interface UpdateRoleArgs {
    serverId: number;
    roleId: number;
    data: any;
}

export interface RoleIdArgs {
    serverId: number;
    roleId: number;
}

export interface UpdateRolePermissionsArgs {
    serverId: number;
    roleId: number;
    permissions: number[];
}

export const rolesQueries = {
    GetServersRoles: (id: number) => ({
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
