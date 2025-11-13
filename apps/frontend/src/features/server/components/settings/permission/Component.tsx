import React, { useEffect, useState } from "react";
import { ModalLayout } from "@/shared";
import {
    useGetPermissionsQuery,
    useGetRolePermissionsQuery,
    useUpdateRolePermissionsMutation,
    useUpdateServerRoleMutation,
} from "@/features/server";
import { Props } from "./interface";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { RoleSettingsFormData } from "./interface";
import { FormInput, SubmitButton, FormError } from "@/shared/ui/Form";

export const RoleSettingsModal: React.FC<Props> = ({ roleId, serverId, roleName, roleColor }) => {
    const { t } = useTranslation("server");
    const [open, setOpen] = useState(false);

    const { data: allPermissions = [] } = useGetPermissionsQuery({});
    const {
        data: rolePermissionsData = [],
        refetch,
        isFetching,
    } = useGetRolePermissionsQuery({ roleId, serverId }, { skip: !roleId });

    const [updateRolePermissions, updatePermState] = useUpdateRolePermissionsMutation();
    const [updateServerRole, updateRoleState] = useUpdateServerRoleMutation();

    // === RHF setup ===
    const form = useForm<RoleSettingsFormData>({
        defaultValues: {
            name: roleName || "",
            color: roleColor || "#5865F2",
            permissions: [],
        },
    });

    const { register, handleSubmit, setValue, watch, formState } = form;
    const { errors } = formState;

    // === Sync role permissions when modal opens ===
    useEffect(() => {
        if (open && roleId) refetch();
    }, [open, roleId]);

    useEffect(() => {
        if (rolePermissionsData && Array.isArray(rolePermissionsData)) {
            const ids = rolePermissionsData.map((p: any) => p.id);
            setValue("permissions", ids);
        }
    }, [rolePermissionsData]);

    const togglePermission = (pid: number) => {
        const current = watch("permissions") || [];
        setValue(
            "permissions",
            current.includes(pid) ? current.filter((id) => id !== pid) : [...current, pid]
        );
    };

    const onSubmit: SubmitHandler<RoleSettingsFormData> = async (data) => {
        if (roleName.toLowerCase() === "creator") return;

        try {
            // update role info (name + color)
            await updateServerRole({
                roleId,
                serverId,
                data: { name: data.name, color: data.color },
            }).unwrap();

            // update permissions if not creator
            if (roleName.toLowerCase() !== "creator") {
                await updateRolePermissions({
                    serverId,
                    roleId,
                    permissions: data.permissions,
                }).unwrap();
            }

            setOpen(false);
        } catch (err) {
            console.error("Failed to update role:", err);
        }
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
                <div className="p-0 w-[350px] text-white">
                    {/* Header */}
                    <div className="bg-background w-full rounded flex items-center justify-between p-5">
                        <div className="font-semibold">{t("settings.editmodal")}</div>
                        <button className="cursor-pointer" onClick={() => setOpen(false)}>
                            <X />
                        </button>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="p-5 flex flex-col gap-4"
                        autoComplete="off"
                    >
                        {/* Role name */}
                        <FormInput<RoleSettingsFormData>
                            name="name"
                            type="text"
                            label={t("settings.rolename")}
                            placeholder={t("settings.rolename")}
                            register={register}
                            disabled={["creator", "default"].includes(roleName.toLowerCase())}
                            validation={{ required: t("settings.rolename_required") }}
                            error={errors.name}
                        />

                        {/* Role color */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                {t("settings.rolecolor")}
                            </label>
                            <input
                                type="color"
                                {...register("color")}
                                className="w-16 h-10 cursor-pointer border rounded bg-transparent"
                            />
                        </div>

                        {/* Permissions */}
                        <div className="flex flex-col gap-1 max-h-[200px] overflow-auto border-t border-white/20 pt-2">
                            {roleName.toLowerCase() === "creator" ? (
                                <div className="text-sm text-gray-400">{t("settings.error")}</div>
                            ) : isFetching ? (
                                <div>{t("settings.loading")}...</div>
                            ) : (
                                allPermissions.map((perm: any) => (
                                    <label
                                        key={perm.id}
                                        className="flex justify-between items-center text-sm py-0.5"
                                    >
                                        <span>{t(`settings.role.${perm.name}`)}</span>
                                        <input
                                            type="checkbox"
                                            checked={watch("permissions")?.includes(perm.id)}
                                            onChange={() => togglePermission(perm.id)}
                                            className="accent-foreground/80"
                                        />
                                    </label>
                                ))
                            )}
                        </div>

                        {/* Submit */}
                        <SubmitButton
                            label={
                                updatePermState.isLoading || updateRoleState.isLoading
                                    ? `${t("settings.confirm")}...`
                                    : t("settings.confirm")
                            }
                            loading={updatePermState.isLoading || updateRoleState.isLoading}
                            className="w-full mt-3"
                        />

                        <FormError
                            message={
                                (updatePermState.error as any)?.data?.message ||
                                (updateRoleState.error as any)?.data?.message
                            }
                        />
                    </form>
                </div>
            </ModalLayout>
        </>
    );
};
