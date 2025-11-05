import React, { useState, useEffect } from "react";
import { ModalInput, ModalLayout } from "@/shared";
import {
    useGetPermissionsQuery,
    useGetRolePermissionsQuery,
    useUpdateRolePermissionsMutation,
    useUpdateServerRoleMutation,
} from "@/features/server";
import { Props } from "./interface";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

export const Component: React.FC<Props> = ({ roleId, serverId, roleName, roleColor }) => {
    const { t } = useTranslation("server");
    const roleIdNum = Number(roleId);

    const { data: allPermissions = [] } = useGetPermissionsQuery({});
    const { data: rolePermissionsData = [], refetch, isFetching } =
  useGetRolePermissionsQuery(roleIdNum, { skip: !roleIdNum });
    const [updateRolePermissions, { isLoading }] = useUpdateRolePermissionsMutation();
    const [updateServerRole, { isLoading: isUpdatingRole }] = useUpdateServerRoleMutation();

    const [open, setOpen] = useState(false);
    const [rolePermissions, setRolePermissions] = useState<number[]>([]);
    const [name, setName] = useState(roleName);
    const [color, setColor] = useState(roleColor || "#5865F2");

    useEffect(() => {
        const perms = rolePermissionsData;
        if (Array.isArray(perms) && perms.length > 0) {
            const newIds = perms.map((p: any) => p.id);
            if (JSON.stringify(newIds) !== JSON.stringify(rolePermissions)) {
                setRolePermissions(newIds);
            }
        }
    }, [rolePermissionsData]);

    useEffect(() => {
        if (open && roleId) refetch();
    }, [open, roleId]);


    const togglePermission = (pid: number) => {
        setRolePermissions((prev) =>
            prev.includes(pid) ? prev.filter((id) => id !== pid) : [...prev, pid]
        );
    };

    const save = async () => {
        if (roleName.toLowerCase() === "creator") {
            return;
        }

        await updateServerRole({ roleId, serverId, data: { name, color } });
        if (roleName.toLowerCase() !== "creator") {
            await updateRolePermissions({ roleId, permissions: rolePermissions });
        }
        setOpen(false);
    };
    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="cursor-pointer px-3 py-1 bg-foreground/70 hover:bg-foreground rounded text-sm text-white"
            >
                {t("settings.edit")}
            </button>

            <ModalLayout open={open} onClose={() => setOpen(false)}>
                <div className="p-0 w-[300px]">
                    <div className="bg-background w-full rounded flex items-center justify-baseline p-5">
                        <div className="w-full">{t("settings.editmodal")}</div>
                        <button className="cursor-pointer p-0 w-fit" onClick={() => setOpen(false)}>
                            <X />
                        </button>
                    </div>
                    <div className="p-5">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                {t("settings.rolename")}
                            </label>
                            <ModalInput
                                change={(e) => setName(e.target.value)}
                                value={name}
                                disabled={["creator", "default"].includes(roleName.toLowerCase())}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                {t("settings.rolecolor")}
                            </label>
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="w-16 h-10 cursor-pointer border rounded"
                            />
                        </div>
                        <div className="">
                            {roleName.toLowerCase() === "creator" ? (
                                <div className="text-sm text-gray-400">{t("settings.error")}</div>
                            ) : (
                                allPermissions ? allPermissions.map((perm: any) => (
                                    <div
                                        key={perm.id}
                                        className="flex justify-between items-center"
                                    >
                                        <span>{t(`settings.role.${perm.name}`)} </span>
                                        <input
                                            type="checkbox"
                                            checked={rolePermissions.includes(perm.id)}
                                            onChange={() => togglePermission(perm.id)}
                                        />
                                    </div>
                                )) : null
                            )}
                        </div>
                        <button
                            onClick={save}
                            disabled={isLoading || isUpdatingRole}
                            className="mt-4 w-full bg-background/70 hover:bg-background text-white py-2 rounded  disabled:opacity-50"
                        >
                            {isLoading || isUpdatingRole
                                ? `${t("settings.confirm")}....`
                                : t("settings.confirm")}
                        </button>
                    </div>
                </div>
            </ModalLayout>
        </>
    );
};
