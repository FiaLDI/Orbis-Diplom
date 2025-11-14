// features/members/ui/useMembersPanelModel.ts
import { useState, useMemo, useCallback } from "react";
import { useAppSelector } from "@/app/hooks";
import { useLazyGetInfoUserQuery } from "@/features/user";
import {
  useBanUserMutation,
  useKickUserMutation,
  useUnbanUserMutation,
} from "@/features/moderation";
import { useContextMenu } from "@/shared/hooks";
import { useTranslation } from "react-i18next";

type Member = {
  id: string;
  username: string;
  avatar_url?: string;
};

type MenuItem =
  | {
      type: "item";
      label: string;
      action: () => void;
      danger?: boolean;
      disabled?: boolean;
    }
  | { type: "separator" };

export function useMembersPanelModel() {
  const { t } = useTranslation("server");

  const activeserver = useAppSelector((s) => s.server.activeserver);
  const activeserverId = activeserver?.id as string | undefined;
  const membersServer = activeserver?.users as Member[] | undefined;

  const chatinfo = useAppSelector((s) => s.chat.activeChat as any);
  const meId = useAppSelector((s) => s.auth.user?.info.id) as
    | string
    | undefined;

  const users: Member[] | undefined = activeserverId
    ? membersServer
    : chatinfo?.users;

  // TODO: подтягивать реальные права из стора
  const myServerPermissions: string[] = [
    "BAN_MEMBERS",
    "KICK_MEMBERS",
    "VIEW_AUDIT_LOG",
    "MANAGE_ROLES",
    "MANAGE_CHANNELS",
    "MANAGE_MESSAGES",
    "ADMINISTRATOR",
  ];
  const canKick = myServerPermissions.includes("KICK_MEMBERS");
  const canBan = myServerPermissions.includes("BAN_MEMBERS");

  const [triggerProfile] = useLazyGetInfoUserQuery();
  const [banUser, { isLoading: banLoading }] = useBanUserMutation();
  const [unbanUser, { isLoading: unbanLoading }] = useUnbanUserMutation();
  const [kickUser, { isLoading: kickLoading }] = useKickUserMutation();

  const { contextMenu, handleContextMenu, closeMenu, menuRef } =
    useContextMenu<Member>();

  const [banModal, setBanModal] = useState<{
    open: boolean;
    userId?: string;
    username?: string;
  }>({ open: false });

  const onViewProfile = useCallback(
    (id: string) => triggerProfile(id),
    [triggerProfile],
  );

  const doKick = useCallback(
    async (userId: string) => {
      if (!activeserverId) return;
      await kickUser({ serverId: activeserverId, userId })
        .unwrap()
        .catch(() => {});
    },
    [activeserverId, kickUser],
  );

  const doUnban = useCallback(
    async (userId: string) => {
      if (!activeserverId) return;
      await unbanUser({ serverId: activeserverId, userId })
        .unwrap()
        .catch(() => {});
    },
    [activeserverId, unbanUser],
  );

  const confirmBan = useCallback(
    async (reason: string) => {
      if (!banModal.userId || !activeserverId) return;
      await banUser({
        serverId: activeserverId,
        userId: banModal.userId,
        reason,
      })
        .unwrap()
        .catch(() => {});
      setBanModal({ open: false });
    },
    [banModal.userId, activeserverId, banUser],
  );

  const menuItems: MenuItem[] = useMemo(() => {
    if (!contextMenu?.data) return [];
    const target = contextMenu.data;
    const isSelf = meId === target.id;

    return [
      {
        type: "item",
        label: t("moderate.open"),
        action: () => onViewProfile(target.id),
      },
      {
        type: "item",
        label: t("moderate.copy"),
        action: () => navigator.clipboard?.writeText(String(target.id)),
      },
      { type: "separator" },
      {
        type: "item",
        label: t("moderate.kick"),
        action: () => doKick(target.id),
        danger: true,
        disabled: !canKick || isSelf || !activeserverId || kickLoading,
      },
      {
        type: "item",
        label: t("moderate.ban"),
        action: () =>
          setBanModal({
            open: true,
            userId: target.id,
            username: target.username,
          }),
        danger: true,
        disabled: !canBan || isSelf || !activeserverId || banLoading,
      },
      {
        type: "item",
        label: t("moderate.unban"),
        action: () => doUnban(target.id),
        disabled: !canBan || isSelf || !activeserverId || unbanLoading,
      },
    ];
  }, [
    contextMenu?.data,
    meId,
    canKick,
    canBan,
    activeserverId,
    kickLoading,
    banLoading,
    unbanLoading,
    t,
    onViewProfile,
    doKick,
    doUnban,
  ]);

  return {
    users,
    count: users?.length ?? 0,
    meId,
    menu: {
      visible: Boolean(contextMenu),
      x: contextMenu?.x ?? 0,
      y: contextMenu?.y ?? 0,
      items: menuItems,
      ref: menuRef as React.RefObject<HTMLElement>,
      open: handleContextMenu,
      close: closeMenu,
    },
    banModal: {
      state: banModal,
      close: () => setBanModal({ open: false }),
      confirm: confirmBan,
    },
    onClickUser: onViewProfile,
  };
}
