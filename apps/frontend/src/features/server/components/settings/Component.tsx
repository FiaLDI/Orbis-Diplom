import React from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { X, Plus } from "lucide-react";

import {
  setSettingsActive,
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useDeleteServerMutation,
  useEmitServerUpdate,
  useUpdateServerMutation,
} from "@/features/server";
import { uploadFiles } from "@/features/upload";
import { AuditDrawer } from "@/features/moderation";
import { RoleSettingsModal } from "./permission";
import { AssignRolesModal } from "./assignroles";

import { AvatarUpload } from "@/shared/ui/Upload/AvatarUpload";
import { FormInput, SubmitButton, FormError } from "@/shared/ui/Form";
import { useForm, SubmitHandler } from "react-hook-form";
import { ServerSettingsFormData } from "./interface";

export const ServerSettingsForm: React.FC = () => {
  const { activeserver } = useAppSelector((s) => ({
    activeserver: s.server.activeserver,
  }));
  const upload = useAppSelector((s) => s.upload);

  const { t } = useTranslation("server");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [updateServer, updateState] = useUpdateServerMutation();
  const [deleteServer] = useDeleteServerMutation();
  const [createRole] = useCreateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();
  const emitUpdate = useEmitServerUpdate();

  const form = useForm<ServerSettingsFormData>({
    defaultValues: {
      name: activeserver?.name || "",
      avatar_url: activeserver?.avatar_url || "",
    },
  });

  const { register, handleSubmit, formState, setValue, watch } = form;
  const { errors } = formState;

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    await dispatch(uploadFiles([file]));
    if (upload.files.length > 0) {
      setValue("avatar_url", upload.files[0].url);
    }
  };

  const handleCreateRole = async () => {
    if (!activeserver?.id) return;
    await createRole({ id: activeserver.id, data: { name: "custom" } });
    await emitUpdate(activeserver.id);
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!activeserver?.id) return;
    await deleteRole({ serverId: activeserver.id, roleId });
    await emitUpdate(activeserver.id);
  };

  const onSubmit: SubmitHandler<ServerSettingsFormData> = async (data) => {
    if (!activeserver?.id) return;
    try {
      await updateServer({
        id: activeserver.id,
        data: {
          name: data.name,
          avatar_url: data.avatar_url ?? "",
        },
      }).unwrap();
      await emitUpdate(activeserver.id);
    } catch (err) {
      console.error("Failed to update server:", err);
    }
  };

  if (!activeserver) return null;

  return (
    <div className="flex flex-col h-full w-full p-5 rounded-[5px] lg:h-screen text-white overflow-auto scroll-hidden">
      <div className="w-full h-full bg-background/50 overflow-auto scroll-hidden">
        <div className="bg-foreground w-full rounded flex items-center justify-between p-5">
          <div className="w-full text-xl font-semibold">
            {t("settings.title")} {activeserver?.name}
          </div>
          <button
            className="cursor-pointer p-0 w-fit"
            onClick={() => dispatch(setSettingsActive(false))}
          >
            <X />
          </button>
        </div>

        {/* ===================== SERVER SETTINGS ===================== */}
        <div className="p-5 flex flex-col gap-5 border-b border-white/20">
          <h4 className="text-2xl">{t("settings.server_settings")}</h4>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
            autoComplete="off"
          >
            {/* Server name */}
            <FormInput<ServerSettingsFormData>
              name="name"
              type="text"
              label={t("settings.server_name")}
              placeholder="Server name"
              register={register}
              validation={{ required: t("settings.server_name_required") }}
              error={errors.name}
            />

            {/* Avatar */}
            <div className="flex flex-col gap-2">
              <label className="text-sm opacity-70">
                {t("settings.server_avatar")}
              </label>
              <AvatarUpload
                avatarUrl={
                  watch("avatar_url") ||
                  activeserver.avatar_url ||
                  "/img/icon.png"
                }
                onSelect={handleAvatarSelect}
                label={t("settings.server_avatar")}
                progress={upload.overallProgress}
                loading={upload.loading}
              />
            </div>

            {/* Save button */}
            <SubmitButton
              label={
                updateState.isLoading
                  ? t("settings.saving")
                  : t("settings.save")
              }
              loading={updateState.isLoading}
              className="w-fit"
            />

            <FormError message={(updateState.error as any)?.data?.message} />
          </form>
        </div>

        {/* ===================== MEMBERS ===================== */}
        <div className="p-5 flex flex-col gap-5 border-b border-white/20">
          <h4 className="text-2xl">{t("settings.members")}</h4>
          {activeserver?.users?.map((user, idx) => (
            <div
              key={`member-server-${idx}`}
              className="flex w-full gap-5 items-center justify-between"
            >
              <div className="flex w-full gap-5 items-center">
                <img
                  src={user.avatar_url || "/img/icon.png"}
                  alt=""
                  className="shrink-0 w-[40px] h-[40px] rounded"
                />
                <div>{user.username}</div>
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

              <AssignRolesModal
                userId={user.id}
                serverId={activeserver.id}
                availableRoles={
                  activeserver.roles?.map((r: any) => ({
                    id: r.id,
                    name: r.name,
                    color: r.color,
                  })) ?? []
                }
                userRoles={user.roles.map((r) => ({
                  id: r.id,
                  name: r.name,
                }))}
              />
            </div>
          ))}
        </div>

        {/* ===================== ROLES ===================== */}
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
            {activeserver?.roles?.map((role: any, index: number) => (
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
                  <RoleSettingsModal
                    roleId={role.id}
                    roleName={role.name}
                    serverId={activeserver.id}
                    roleColor={role.color}
                  />
                  <button
                    onClick={() => handleDeleteRole(role.id)}
                    className="px-3 py-1 bg-foreground/70 cursor-pointer rounded hover:bg-foreground text-sm"
                    disabled={
                      role.name === "creator" || role.name === "default"
                    }
                  >
                    {t("settings.delete")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===================== DELETE SERVER ===================== */}
        <div className="p-5 flex flex-col w-full gap-5">
          <h4 className="text-2xl">{t("settings.delete_critical.title")}</h4>
          <button
            className="bg-red-500 px-5 py-3 rounded hover:bg-red-600 transition"
            onClick={() => {
              deleteServer(activeserver.id);
              navigate("/app");
            }}
          >
            {t("settings.delete_critical.submit")}
          </button>
        </div>

        <AuditDrawer />
      </div>
    </div>
  );
};
