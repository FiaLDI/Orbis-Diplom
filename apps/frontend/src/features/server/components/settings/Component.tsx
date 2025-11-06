import React from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Component as PermissionComponent } from "./permission";
import { Component as AssignRolesButton } from "./assignroles";
import {
    setSettingsActive,
    useCreateRoleMutation,
    useDeleteRoleMutation,
    useDeleteServerMutation,
    useEmitServerUpdate,
    useUpdateServerMutation,
} from "../..";
import { Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AuditDrawer } from "@/features/moderation";
import { uploadFiles } from "@/features/upload";
import { useNavigate } from "react-router-dom";

export const Component: React.FC = () => {
    const { activeserver } = useAppSelector((s) => ({
        activeserver: s.server.activeserver,
    }));
    const { t } = useTranslation("server");
    const navigator = useNavigate();

    const upload = useAppSelector(s => s.upload);
    const [updateServer] = useUpdateServerMutation();
    const [deleteServer] = useDeleteServerMutation();

    const [serverName, setServerName] = React.useState(activeserver?.name || "");
    const [avatarPreview, setAvatarPreview] = React.useState<string | null>(activeserver?.avatar_url || null);

    const dispatch = useAppDispatch();

    const [createRole] = useCreateRoleMutation();
    const [deleteRole] = useDeleteRoleMutation();
    const emitUpdate = useEmitServerUpdate();

    const handleCreateRole = async () => {
        if (!activeserver?.id) return;
        await createRole({ id: activeserver.id, data: { name: "custom" } });
        await emitUpdate(activeserver?.id);
    };

    const handleDeleteRole = async (roleId: number) => {
        if (!activeserver?.id) return;
        await deleteRole({ serverId: activeserver.id, roleId });
        await emitUpdate(activeserver?.id);
    };

    const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        setAvatarPreview(URL.createObjectURL(file));

        await dispatch(uploadFiles([file]));
    };

    const handleUpdateServer = async () => {
        if (!activeserver?.id) return;

        const avatarUrl =
            upload.files.length > 0 ? upload.files[0].url : activeserver.avatar_url || "";

        if (!avatarUrl) return;

        await updateServer({
            id: activeserver.id,
            data: {
                name: serverName,
                avatar_url: avatarUrl,
            },
        });

        await emitUpdate(activeserver?.id);
    };

    if (!activeserver) return null;

    return (
        <div className="flex flex-col h-full w-full p-5 rounded-[5px] lg:h-screen text-white overflow-auto scroll-hidden">
            <div className="w-full h-full bg-background/50 overflow-auto scroll-hidden">
                <div className="bg-foreground w-full rounded flex items-center justify-baseline p-5">
                    <div className="w-full">
                        {t("settings.title")} {activeserver?.name}
                    </div>
                    <button
                        className="cursor-pointer p-0 w-fit"
                        onClick={() => dispatch(setSettingsActive(false))}
                    >
                        <X />
                    </button>
                </div>

                <div className="p-5">
                    <div className="p-5 flex flex-col gap-5 border-b border-white/20">
                        <h4 className="text-2xl">{t("settings.server_settings")}</h4>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm opacity-70">{t("settings.server_name")}</label>
                            <input
                                className="bg-background px-3 py-2 rounded text-white"
                                value={serverName}
                                onChange={(e) => setServerName(e.target.value)}
                                placeholder="Server name"
                            />
                        </div>

                        {/* AVATAR UPLOADER */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm opacity-70">{t("settings.server_avatar")}</label>

                            <div className="flex items-center gap-4">
                                <img
                                    src={avatarPreview || "/img/icon.png"}
                                    className="w-[60px] h-[60px] rounded-full object-cover bg-black/40"
                                />

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarSelect}
                                />
                            </div>

                            {upload.loading && (
                                <div className="text-sm opacity-80">
                                    Uploading: {upload.overallProgress}%
                                </div>
                            )}
                        </div>

                        {/* SAVE BUTTON */}
                        <button
                            onClick={handleUpdateServer}
                            className="px-4 py-2 bg-foreground rounded w-fit hover:bg-foreground/70"
                        >
                            {t("settings.save")}
                        </button>
                    </div>
                    
                    <div className="p-5 flex flex-col gap-5 border-b border-white/20">

                    <h4 className="text-2xl">{t("settings.members")}</h4>
                    {activeserver?.users?.map((user, idx) => (
                        <div
                            key={`member-server-${idx}`}
                            className="flex w-full gap-5 items-center justify-between"
                        >
                            <div className="flex w-full gap-5 items-center ">
                                <img
                                    src={user.avatar_url ? user.avatar_url : "/img/icon.png"}
                                    alt=""
                                    className="shrink-0 w-[40px] h-[40px]"
                                />
                                <div className=" ">{user.username}</div>
                                <div className="flex gap-2">
                                    {user?.roles?.map((role, index) => (
                                        <span
                                            key={`role-${index}-${role.id}`}
                                            className="px-2 py-0.5 rounded text-xs"
                                            style={{
                                                backgroundColor: role.color || "#2e3ed328",
                                            }}
                                        >
                                            {role.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <AssignRolesButton
                                userId={user.id}
                                serverId={activeserver.id}
                                availableRoles={
                                    activeserver?.roles?.map((r: any) => ({
                                        id: Number(r.id),
                                        name: r.name,
                                        color: r.color,
                                    })) ?? []
                                }
                                userRoles={user.roles.map((r) => ({
                                    id: Number(r.id),
                                    name: r.name,
                                }))}
                            />
                        </div>
                    ))}
                    </div>

                    <div className="p-5 flex flex-col w-full gap-5 border-b border-white/20">
                        <div className="w-full flex gap-5 items-center">
                            <h4 className="text-2xl">{t("settings.roles")}</h4>
                            <button
                                className="cursor-pointer px-1 py-1 bg-foreground rounded-full"
                                onClick={handleCreateRole}
                            >
                                <Plus />
                            </button>
                        </div>
                        <div className="w-full flex flex-col">
                            {activeserver?.roles
                                ? activeserver?.roles?.map((role: any, index: number) => (
                                    <div
                                        key={`roles-${index}`}
                                        className="flex w-full items-center justify-between border-b border-white/30 p-2"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="px-3 py-1 rounded text-sm"
                                                style={{ backgroundColor: role.color || "#2e3ed328" }}
                                            >
                                                {role.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <PermissionComponent
                                                roleId={Number(role.id)}
                                                roleName={role.name}
                                                serverId={Number(activeserver.id)}
                                            />
                                            <button
                                                onClick={() => handleDeleteRole(Number(role.id))}
                                                className="px-3 py-1 bg-foreground/70 cursor-pointer rounded hover:bg-foreground text-sm"
                                                disabled={
                                                    role.name === "creator" || role.name === "default"
                                                }
                                            >
                                                {t("settings.delete")}
                                            </button>
                                        </div>
                                    </div>
                                ))
                                : null}
                        </div>
                    </div>

                    <div className="p-5 flex flex-col w-full gap-5">
                        <h4 className="text-2xl">{t("settings.delete_critical.title")}</h4>
                        <div className="">
                            <button 
                                className="bg-red-500 px-5 py-3 rounded"
                                onClick={()=>{
                                    deleteServer(activeserver.id)
                                    //navigator("/app")
                                }}
                            >
                                {t("settings.delete_critical.submit")}
                            </button>
                        </div>
                    </div>
                    
                </div>
                
                <AuditDrawer />
            </div>
        </div>
    );
};
