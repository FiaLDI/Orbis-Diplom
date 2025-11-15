import React from "react";
import { RoleSettingsModal } from "./permission";

export const RoleRow: React.FC<{
  role: any;
  serverId: string;
  allPermissions: any[];
  emitServerUpdate: (type: any, serverId: string) => void;
  onDelete: (id: string) => void;
  t: (k: string) => string;
}> = ({ role, serverId, allPermissions, emitServerUpdate, onDelete, t }) => {
  const reserved = ["creator", "default"].includes(role.name?.toLowerCase?.());
  return (
    <div className="flex w-full items-center justify-between border-b border-white/30 p-2">
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
          t={t as any}
          roleId={role.id}
          roleName={role.name}
          roleColor={role.color}
          serverId={serverId}
          allPermissions={allPermissions}
          emitServerUpdate={emitServerUpdate}
        />
        <button
          onClick={() => onDelete(role.id)}
          className="px-3 py-1 bg-foreground/70 cursor-pointer rounded hover:bg-foreground text-sm"
          disabled={reserved}
        >
          {t("settings.delete")}
        </button>
      </div>
    </div>
  );
};
