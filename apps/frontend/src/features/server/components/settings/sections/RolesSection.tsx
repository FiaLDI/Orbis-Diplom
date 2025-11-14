import React from "react";
import { Plus } from "lucide-react";
import { RoleRow } from "../RoleRow";

type TFn = (key: string) => string;

export const RolesSection: React.FC<{
  t: TFn;
  serverId: string;
  roles: any[];
  allPermissions: any[];
  onCreateRole: () => void;
  onDeleteRole: (roleId: string) => void;
  emitServerUpdate: (type: any, serverId: string) => void;
}> = ({
  t,
  serverId,
  roles,
  allPermissions,
  onCreateRole,
  onDeleteRole,
  emitServerUpdate,
}) => {
  return (
    <div className="p-5 flex flex-col w-full gap-5 border-b border-white/20">
      <div className="w-full flex gap-5 items-center">
        <h4 className="text-2xl">{t("settings.roles")}</h4>
        <button
          className="cursor-pointer px-1 py-1 bg-foreground rounded-full"
          onClick={onCreateRole}
        >
          <Plus />
        </button>
      </div>

      <div className="w-full flex flex-col">
        {roles.map((role: any) => (
          <RoleRow
            key={role.id}
            role={role}
            serverId={serverId}
            allPermissions={allPermissions}
            emitServerUpdate={emitServerUpdate}
            onDelete={onDeleteRole}
            t={t as any}
          />
        ))}
      </div>
    </div>
  );
};
