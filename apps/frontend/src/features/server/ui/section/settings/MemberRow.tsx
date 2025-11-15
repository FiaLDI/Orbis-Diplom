import React from "react";
import { AssignRolesModal } from "./assignroles";

export const MemberRow: React.FC<{
  member: any;
  serverId: string;
  roles: { id: string; name: string; color?: string }[];
  emitServerUpdate: (type: any, serverId: string) => void;
  t: (k: string) => string;
}> = ({ member, serverId, roles, emitServerUpdate, t }) => (
  <div className="flex w-full gap-5 items-center justify-between">
    <div className="flex w-full gap-5 items-center">
      <img
        src={member.avatar_url || "/img/icon.png"}
        alt=""
        className="shrink-0 w-[40px] h-[40px] rounded"
      />
      <div>{member.username}</div>
      <div className="flex gap-2">
        {member?.roles?.map((role: any) => (
          <span
            key={role.id}
            className="px-2 py-0.5 rounded text-xs"
            style={{ backgroundColor: role.color || "#2e3ed328" }}
          >
            {role.name}
          </span>
        ))}
      </div>
    </div>

    <AssignRolesModal
      t={t as any}
      emitServerUpdate={emitServerUpdate}
      userId={member.id}
      serverId={serverId}
      availableRoles={roles}
      userRoles={member.roles.map((r: any) => ({ id: r.id, name: r.name }))}
    />
  </div>
);
