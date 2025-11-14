import React from "react";
import { ModalButton } from "@/shared/ui";

interface Props {
  user: any;
  onMessage: (id: string) => void;
  onInvite: (id: string) => void;
  t: any;
}

export const SearchResultItem: React.FC<Props> = ({
  user,
  onMessage,
  onInvite,
  t,
}) => (
  <li className="flex gap-10 bg-[#4a55e9] p-3 justify-between rounded">
    <div className="flex items-center gap-2">
      <img
        src={user.avatar_url || "/img/icon.png"}
        alt=""
        className="w-15 h-15 lg:w-10 lg:h-10 rounded-full object-cover"
      />
      <span className="text-3xl lg:text-base">{user.username}</span>
    </div>

    <div className="flex gap-5">
      <ModalButton handler={() => onMessage(user.id)}>
        {t("modal.message")}
      </ModalButton>
      <ModalButton handler={() => onInvite(user.id)}>
        {t("modal.addfriend")}
      </ModalButton>
    </div>
  </li>
);
