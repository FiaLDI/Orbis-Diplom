import { permission } from "@/features/user";
import { TFunction } from "i18next";

export interface Props {
    roleId: string;
    roleName: string;
    roleColor?: string;
    serverId: string;
    allPermissions?: permission[];
    t: TFunction<"server", undefined>;
    emitServerUpdate: any;
}

export type RoleSettingsFormData = {
    name: string;
    color: string;
    permissions: number[];
};
