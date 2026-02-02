import React from "react";
import { FriendsSidebar } from "./FriendsSidebar";
import { FriendsList } from "./FriendsList";
import { AnimatedContextMenu } from "@/shared/ui";
import { useFriendsModel } from "../../hooks";

export const Component: React.FC = () => {
  const m = useFriendsModel();

  return (
    <>
      <div className="w-full h-full flex text-white p-5 rounded-[5px] z-10 gap-5">
        <FriendsList
          items={m.filteredFriends}
          mode={m.mode}
          onlineUsers={m.filteredFriends.map((f) => f.id)} // или m.onlineUsers
          onClick={m.handleClick}
          onContext={m.handleContextMenu}
          onConfirm={m.confirmFriend}
          onReject={m.reject}
        />
        <FriendsSidebar t={m.t} />
      </div>

      <AnimatedContextMenu
        visible={!!m.contextMenu}
        x={m.contextMenu?.x || 0}
        y={m.contextMenu?.y || 0}
        items={[
          {
            label: m.t("action.startchat"),
            action: () => m.handleStartChat(m.contextMenu?.data?.id),
          },
          {
            label: m.t("action.deletefriend"),
            action: () => m.handleRemoveFriend(m.contextMenu?.data?.id),
            danger: true,
          },
        ]}
        onClose={m.closeMenu}
        menuRef={m.menuRef}
      />

      {m.modal}
    </>
  );
};
