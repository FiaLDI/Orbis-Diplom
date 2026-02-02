import React, { useState } from "react";
import { CloseButton, HeadComponent, ModalLayout } from "@/shared";
import { FormInput, SubmitButton, FormError } from "@/shared/ui/Form";
import type { Props } from "./interface";
import { useRoleSettingsModalModel } from "@/features/server/hook";
import { RoleSettingsFormData } from "@/features/server/types";

export const RoleSettingsModal: React.FC<Props> = ({
  t,
  roleId,
  serverId,
  roleName,
  roleColor,
  allPermissions,
  emitServerUpdate,
}) => {
  const [open, setOpen] = useState(false);
  const m = useRoleSettingsModalModel(
    roleId,
    roleName,
    roleColor,
    serverId,
    emitServerUpdate,
    () => setOpen(false),
  );
  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          m.form.onOpen();
        }}
        className="cursor-pointer px-3 py-1 bg-foreground/70 hover:bg-foreground rounded text-sm text-white"
      >
        {t("settings.edit")}
      </button>

      <ModalLayout open={open} onClose={() => setOpen(false)}>
        <div className="p-0 w-[350px] text-white">
          <div className="bg-foreground/20 w-full rounded flex items-center justify-between p-2">
            <HeadComponent title={t("settings.editmodal")} />
            <CloseButton handler={() => setOpen(false)} />
          </div>

          <form
            onSubmit={m.form.onSubmit}
            className="p-5 flex flex-col gap-4"
            autoComplete="off"
          >
            <FormInput<RoleSettingsFormData>
              name="name"
              type="text"
              label={t("settings.rolename")}
              placeholder={t("settings.rolename")}
              register={m.form.register}
              disabled={["creator", "default"].includes(roleName.toLowerCase())}
              validation={{ required: t("settings.rolename_required") }}
              error={m.form.formState.errors?.name as any}
            />

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("settings.rolecolor")}
              </label>
              <input
                type="color"
                {...(m.form as any).register("color")}
                className="w-16 h-10 cursor-pointer border rounded bg-transparent"
              />
            </div>

            <div className="flex flex-col gap-1 max-h-[200px] overflow-auto border-t border-white/20 pt-2">
              {roleName.toLowerCase() === "creator" ? (
                <div className="text-sm text-gray-400">
                  {t("settings.error")}
                </div>
              ) : m.query.isFetching ? (
                <div>{t("settings.loading")}...</div>
              ) : (
                allPermissions?.map((perm: any) => (
                  <label
                    key={perm.id}
                    className="flex justify-between items-center text-sm py-0.5"
                  >
                    <span>{t(`settings.role.${perm.name}`)}</span>
                    <input
                      type="checkbox"
                      checked={(m.form.watch("permissions") || []).includes(
                        perm.id,
                      )}
                      onChange={() => m.form.togglePermission(perm.id)}
                      className="accent-foreground/80"
                    />
                  </label>
                ))
              )}
            </div>

            <SubmitButton
              label={
                m.mutation.updatePermState.isLoading ||
                m.mutation.updateRoleState.isLoading
                  ? `${t("settings.confirm")}...`
                  : t("settings.confirm")
              }
              loading={
                m.mutation.updatePermState.isLoading ||
                m.mutation.updateRoleState.isLoading
              }
              className="w-full mt-3"
            />
            <FormError
              message={
                (m.mutation.updatePermState.error as any)?.data?.message ||
                (m.mutation.updateRoleState.error as any)?.data?.message
              }
            />
          </form>
        </div>
      </ModalLayout>
    </>
  );
};
