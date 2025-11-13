export interface Props {
    roleId: string;
    roleName: string;
    roleColor?: string;
    serverId: string;
}

export type RoleSettingsFormData = {
    name: string;
    color: string;
    permissions: number[];
};
