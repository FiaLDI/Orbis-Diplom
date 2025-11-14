import React from "react";

export const NotificationItemView: React.FC<{
  n: any;
  ActionRead: React.ReactNode;
  ActionDelete: React.ReactNode;
}> = ({ n, ActionRead, ActionDelete }) => {
  return (
    <div
      key={n.id}
      className={`flex justify-between items-start py-2 px-1 transition ${
        n.is_read ? "opacity-70" : "opacity-100"
      } hover:bg-[#ffffff0a] rounded-md`}
    >
      <div className="flex flex-col gap-1">
        <p className="font-semibold">{n.title}</p>
        {n.body && <p className="text-sm text-gray-300">{n.body}</p>}
        <span className="text-xs text-gray-500">
          {new Date(n.created_at).toLocaleString()}
        </span>
      </div>

      <div className="flex gap-2 ml-3">
        {ActionRead}
        {ActionDelete}
      </div>
    </div>
  );
};
