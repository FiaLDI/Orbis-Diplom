import React from "react";
import { FriendListItem } from "./FriendListItem";

export const FriendsList: React.FC<{
  items: any[];
  mode: string;
  onlineUsers: string[];
  onClick: (id: string) => void;
  onContext: (e: React.MouseEvent, val: any) => void;
  onConfirm?: (id: string) => void;
  onReject?: (id: string) => void;
}> = ({
  items,
  mode,
  onlineUsers,
  onClick,
  onContext,
  onConfirm,
  onReject,
}) => (
  <ul className="bg-foreground/10 backdrop-blur-sm h-full w-full flex flex-col gap-5 p-5 overflow-y-auto border border-white/30">
    {items.length ? (
      items.map((val) => (
        <FriendListItem
          key={val.id}
          val={val}
          mode={mode}
          onlineUsers={onlineUsers}
          onClick={onClick}
          onContext={onContext}
          onConfirm={onConfirm}
          onReject={onReject}
        />
      ))
    ) : (
      <p className="text-center opacity-60">No friends found</p>
    )}
  </ul>
);
