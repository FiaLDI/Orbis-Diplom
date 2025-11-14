import React, { useState } from "react";
import { CloseButton, HeadComponent, ModalLayout } from "@/shared";
import { X } from "lucide-react";
import { SubmitButton, FormError } from "@/shared/ui/Form";
import type { ComponentProps } from "./interface";
import { useAssignRolesModalModel } from "@/features/server/model/useAssignRolesModalModel";

export const AssignRolesModal: React.FC<ComponentProps> = ({
    t,
    userId,
    serverId,
    availableRoles,
    userRoles,
    emitServerUpdate,
}) => {
    const [open, setOpen] = useState(false);
    const m = useAssignRolesModalModel(serverId, userId, userRoles, emitServerUpdate, () =>
        setOpen(false)
    );

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
                    <div className="bg-background w-full rounded flex items-center justify-between p-5">
                        <HeadComponent title={t("settings.assignmodal")} />
                        <CloseButton handler={() => setOpen(false)} />
                    </div>

                    <form
                        onSubmit={m.form.handleSubmit(m.onSubmit)}
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
                                            checked={(m.form.watch("roles") || []).includes(
                                                role.id
                                            )}
                                            onChange={() => m.toggleRole(role.id)}
                                            className="accent-foreground/80 cursor-pointer"
                                        />
                                    </label>
                                ))}
                        </div>

                        <SubmitButton label={t("settings.confirm")} className="w-full mt-3" />
                        <FormError message={undefined} />
                    </form>
                </div>
            </ModalLayout>
        </>
    );
};
