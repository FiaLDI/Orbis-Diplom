import React from "react";
import { DefaultButton } from "@/shared/ui";
import { setFriendMode } from "../../slice";
import { Component as SearchFriends } from "../search";
import { useAppDispatch } from "@/app/hooks";

export const FriendsSidebar: React.FC<{ t: any }> = ({ t }) => {
  const dispatch = useAppDispatch();

  const buttons = [
    { key: "All", label: t("option.all") },
    { key: "Online", label: t("option.online") },
    { key: "Offline", label: t("option.offline") },
    { key: "Invite", label: t("option.sent") },
    { key: "My Invite", label: t("option.recive") },
    { key: "Blocked", label: t("option.block") },
  ];

  return (
    <div className="relative h-full p-5 flex flex-col bg-background items-center rounded-[5px] justify-between lg:justify-normal">
      <div className="flex flex-col gap-5 w-full pb-5">
        {buttons.map((b) => (
          <DefaultButton
            key={b.key}
            handler={() => dispatch(setFriendMode(b.key as any))}
          >
            {b.label}
          </DefaultButton>
        ))}
      </div>
      <SearchFriends />
    </div>
  );
};
