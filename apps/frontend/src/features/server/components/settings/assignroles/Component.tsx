import React from "react";
import { ModalLayout } from "@/shared";
import {
  useAssignRoleToMemberMutation,
  useEmitServerUpdate,
  useRemoveRoleFromMemberMutation,
} from "@/features/server";
import { ComponentProps } from "./interface";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { AssignRoleFormData } from "./interface";
import { SubmitButton, FormError } from "@/shared/ui/Form";

export const AssignRolesModal: React.FC<ComponentProps> = ({
  userId,
  serverId,
  availableRoles,
  userRoles,
}) => {
  const { t } = useTranslation("server");
  const [open, setOpen] = React.useState(false);

  const [assignRole] = useAssignRoleToMemberMutation();
  const [removeRole] = useRemoveRoleFromMemberMutation();
  const emitUpdate = useEmitServerUpdate();

  const form = useForm<AssignRoleFormData>({
    defaultValues: {
      roles: userRoles.map((r) => r.id),
    },
  });

  const { handleSubmit, watch, setValue } = form;
  const selected = watch("roles");

  const toggleRole = (roleId: string) => {
    const current = selected || [];
    setValue(
      "roles",
      current.includes(roleId)
        ? current.filter((r) => r !== roleId)
        : [...current, roleId],
    );
  };

  const onSubmit: SubmitHandler<AssignRoleFormData> = async (data) => {
    try {
      const toAdd = data.roles.filter(
        (id) => !userRoles.some((r) => r.id === id),
      );
      const toRemove = userRoles
        .map((r) => r.id)
        .filter((id) => !data.roles.includes(id));

      for (const id of toAdd) {
        await assignRole({ serverId, userId, roleId: id }).unwrap();
      }

      for (const id of toRemove) {
        await removeRole({ serverId, userId, roleId: id }).unwrap();
      }

      emitUpdate(serverId);
      setOpen(false);
    } catch (err) {
      console.error("assign roles error:", err);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1 text-sm rounded bg-foreground/70 hover:bg-foreground cursor-pointer whitespace-nowrap"
      >
        {t("settings.assign")}
      </button>

      <ModalLayout open={open} onClose={() => setOpen(false)}>
        <div className="p-0 w-[320px] text-white">
          {/* Header */}
          <div className="bg-background w-full rounded flex items-center justify-between p-5">
            <div className="w-full font-semibold">
              {t("settings.assignmodal")}
            </div>
            <button
              className="cursor-pointer p-0 w-fit"
              onClick={() => setOpen(false)}
            >
              <X />
            </button>
          </div>

          {/* Body */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-5 flex flex-col gap-4"
            autoComplete="off"
          >
            <div className="flex flex-col gap-2 max-h-[220px] overflow-auto border-b border-white/20 pb-2">
              {availableRoles
                .filter((r) => r.name.toLowerCase() !== "creator")
                .map((role) => (
                  <label
                    key={role.id}
                    className="flex justify-between items-center px-2 py-1 rounded hover:bg-background/40 cursor-pointer"
                  >
                    <span
                      className="text-sm"
                      style={{ color: role.color || "white" }}
                    >
                      {role.name}
                    </span>
                    <input
                      type="checkbox"
                      checked={selected.includes(role.id)}
                      onChange={() => toggleRole(role.id)}
                      className="accent-foreground/80 cursor-pointer"
                    />
                  </label>
                ))}
            </div>

            <SubmitButton
              label={t("settings.confirm")}
              className="w-full mt-3"
            />

            <FormError message={undefined} />
          </form>
        </div>
      </ModalLayout>
    </>
  );
};
