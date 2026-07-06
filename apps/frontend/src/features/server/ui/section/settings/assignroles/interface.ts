import { TFunction } from "i18next";

export interface ComponentProps {
    userId: string;
    serverId: string;
    availableRoles: { id: string; name: string; color?: string }[];
    userRoles: { id: string; name: string }[];
    t: TFunction<"server", undefined>;
    emitServerUpdate: any;
}

export interface RoleOption {
    id: string;
    name: string;
    color?: string;
}

export interface AssignRoleFormData {
    roles: string[];
}
