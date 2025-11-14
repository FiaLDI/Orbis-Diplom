import React from "react";

export const BannedRow: React.FC<{ item: any; onUnban: () => void }> = ({
  item,
  onUnban,
}) => (
  <div className="flex justify-between items-center p-3 bg-white/5 border border-white/10 rounded">
    <div className="flex gap-3 items-center">
      <img
        src={item.avatar_url || "/img/icon.png"}
        className="w-10 h-10 rounded"
      />
      <div>
        <div className="font-medium">{item.targetName}</div>
        <div className="text-xs opacity-70">
          {new Date(item.createdAt).toLocaleString("ru-RU")}
        </div>
        {item.reason && (
          <div className="text-xs opacity-70 mt-0.5">Reason: {item.reason}</div>
        )}
      </div>
    </div>
    <button
      className="px-3 py-1 bg-green-600/40 hover:bg-green-600/60 rounded text-sm"
      onClick={onUnban}
    >
      Unban
    </button>
  </div>
);
