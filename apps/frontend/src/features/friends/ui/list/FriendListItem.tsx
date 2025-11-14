import React from "react";
import clsx from "clsx";
import { CirclePlus, CircleMinus } from "lucide-react";

export const FriendListItem: React.FC<{
  val: any;
  mode: string;
  onlineUsers: string[];
  onClick: (id: string) => void;
  onContext: (e: React.MouseEvent, val: any) => void;
  onConfirm?: (id: string) => void;
  onReject?: (id: string) => void;
}> = ({ val, mode, onlineUsers, onClick, onContext, onConfirm, onReject }) => {
  const avatar = val.avatar_url || "/img/icon.png";
  const isOnline = onlineUsers.includes(val.id);
  const isBlocked = val.is_blocked === true;

  return (
    <li
      key={val.id}
      onContextMenu={(e) => onContext(e, val)}
      className={clsx(
        "flex items-center justify-between p-2 rounded-md transition bg-foreground/70 hover:bg-foreground",
        isBlocked && "opacity-60 pointer-events-none",
      )}
    >
      <div
        className="flex gap-3 items-center cursor-pointer w-full"
        onClick={() => onClick(val.id)}
      >
        <div className="relative">
          <img
            src={avatar}
            alt=""
            className="w-15 h-15 lg:w-10 lg:h-10 rounded-full object-cover border border-white/20"
          />
          <span
            className={clsx(
              "absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#25309b88]",
              isBlocked
                ? "bg-gray-500"
                : isOnline
                  ? "bg-green-400"
                  : "bg-gray-600",
            )}
          />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold">{val.username}</span>
          {isBlocked ? (
            <span className="text-xs text-gray-400">Blocked</span>
          ) : isOnline ? (
            <span className="text-xs text-green-400">Online</span>
          ) : (
            <span className="text-xs text-gray-400">Offline</span>
          )}
        </div>
      </div>

      {mode === "My Invite" && (
        <div className="flex gap-2">
          <button
            className="cursor-pointer hover:text-green-400"
            onClick={() => onConfirm?.(val.id)}
          >
            <CirclePlus
              className="w-15 h-15 lg:w-8 lg:h-8"
              strokeWidth="1.25"
            />
          </button>
          <button
            className="cursor-pointer hover:text-red-400"
            onClick={() => onReject?.(val.id)}
          >
            <CircleMinus
              className="w-15 h-15 lg:w-8 lg:h-8"
              strokeWidth="1.25"
            />
          </button>
        </div>
      )}
    </li>
  );
};
