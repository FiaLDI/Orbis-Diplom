import React from "react";

export const LogRow: React.FC<{ log: any }> = ({ log }) => {
  let reason: string | null = null;
  try {
    const meta = JSON.parse(log.metadata || "{}");
    reason = meta?.reason ?? null;
  } catch {}
  return (
    <div className="rounded bg-white/5 p-3 border border-white/10">
      <div className="text-sm opacity-70">
        {new Date(log.createdAt).toLocaleString("ru-RU")}
      </div>
      <div className="text-sm mt-1">
        <b>{log.actorName ?? `User#${log.actorId}`}</b>{" "}
        {log.action === "BAN_ADD" && "забанил"}
        {log.action === "BAN_REMOVE" && "разбанил"}
        {log.action === "KICK" && "кикнул"} {` пользователя `}
        <b>{log.targetName ?? `User#${log.targetId}`}</b>
      </div>
      {reason && (
        <div className="text-xs opacity-70 mt-1">Причина: {reason}</div>
      )}
    </div>
  );
};
