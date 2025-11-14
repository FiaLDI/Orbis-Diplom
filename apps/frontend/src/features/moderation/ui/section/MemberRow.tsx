// ui/members/MemberRow.tsx
import React from "react";

export const MemberRow = React.memo(function MemberRow({
  user,
  isSelf,
  reason,
  onReasonChange,
  onKick,
  onBan,
  onUnban,
}: {
  user: any;
  isSelf: boolean;
  reason: string;
  onReasonChange: (v: string) => void;
  onKick: () => void;
  onBan: () => void;
  onUnban: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-white/20 pb-3">
      <div className="flex gap-3 items-center justify-between">
        <div className="flex gap-3 items-center">
          <img
            src={user.avatar_url || "/img/icon.png"}
            alt=""
            className="w-10 h-10 rounded"
          />
          <div>
            <div className="font-medium">
              {user.username}{" "}
              {isSelf && <span className="text-xs opacity-70">(you)</span>}
            </div>
            <div className="text-xs opacity-70">ID: {user.id}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            disabled={isSelf}
            className={`px-3 py-1 rounded text-sm ${
              isSelf
                ? "opacity-40 cursor-not-allowed bg-gray-700"
                : "bg-yellow-500/30 hover:bg-yellow-500/50"
            }`}
            onClick={onKick}
          >
            Kick
          </button>
          <button
            disabled={isSelf}
            className={`px-3 py-1 rounded text-sm ${
              isSelf
                ? "opacity-40 cursor-not-allowed bg-gray-700"
                : "bg-red-500/40 hover:bg-red-500/60"
            }`}
            onClick={onBan}
          >
            Ban
          </button>
          <button
            disabled={isSelf}
            className={`px-3 py-1 rounded text-sm ${
              isSelf
                ? "opacity-40 cursor-not-allowed bg-gray-700"
                : "bg-green-600/40 hover:bg-green-600/60"
            }`}
            onClick={onUnban}
          >
            Unban
          </button>
        </div>
      </div>
      <div className="flex gap-2 mt-1">
        <input
          disabled={isSelf}
          type="text"
          placeholder="Reason"
          className="flex-1 px-2 py-1 rounded bg-foreground/50 outline-none text-sm placeholder:text-white/40"
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
        />
      </div>
    </div>
  );
});
