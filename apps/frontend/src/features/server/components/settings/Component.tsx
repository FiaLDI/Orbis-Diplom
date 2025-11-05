import React from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Component as PermissionComponent } from "./permission";
import { Component as AssignRolesButton } from "./assignroles";
import {
    setSettingsActive,
    useCreateRoleMutation,
    useDeleteRoleMutation,
    useEmitServerUpdate,
} from "../..";
import { Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AuditDrawer } from "@/features/moderation";

export const Component: React.FC = () => {
    const { activeserver } = useAppSelector((s) => ({
        activeserver: s.server.activeserver,
    }));
    const { t } = useTranslation("server");

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

    if (!activeserver) return null;

    return (
        <div className="flex flex-col h-full w-full p-5 rounded-[5px] lg:h-screen text-white overflow-auto scroll-hidden">
            <div className="w-full h-full bg-background/50">
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

                <div className="p-5 flex flex-col w-full gap-5">
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
            </div>
            <div className="">
                <AuditDrawer />
            </div>
        </div>
    );
};
