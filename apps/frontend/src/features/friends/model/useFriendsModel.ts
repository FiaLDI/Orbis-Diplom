import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useTranslation } from "react-i18next";
import {
  useLazyGetInfoUserQuery,
  useStartChattingMutation,
} from "@/features/user";
import {
  useLazyGetFriendQuery,
  useLazyGetOutcomingRequestsQuery,
  useLazyGetIncomingRequestsQuery,
  useConfirmFriendRequestMutation,
  useRejectFriendRequestMutation,
  useGetFriendQuery,
  useRemoveFriendMutation,
  useBlockFriendMutation,
  useUnblockFriendMutation,
} from "..";
import { setFriendMode } from "../slice";
import { useContextMenu } from "@/shared/hooks";
import { useConfirm } from "@/shared/hooks/confirm/useConfirm";

export function useFriendsModel() {
  const { t } = useTranslation("friends");
  const dispatch = useAppDispatch();
  const mode = useAppSelector((s) => s.friends.friendsMode);
  const friends = useAppSelector((s) => s.friends.friends);
  const onlineUsers = useAppSelector((s) => s.notification.onlineUsers);

  const [trigger] = useLazyGetInfoUserQuery();
  const [getFriends] = useLazyGetFriendQuery();
  const [getInvI] = useLazyGetOutcomingRequestsQuery();
  const [getInvMe] = useLazyGetIncomingRequestsQuery();
  const [confirmFriend, { isSuccess: confirmSuccess }] =
    useConfirmFriendRequestMutation();
  const [reject, { isSuccess: confirmReject }] =
    useRejectFriendRequestMutation();
  const [unblockFriend] = useUnblockFriendMutation();
  const [removeFriend] = useRemoveFriendMutation();
  const [blockFriend] = useBlockFriendMutation();
  const [startChat] = useStartChattingMutation();
  useGetFriendQuery({});

  const { confirm, modal } = useConfirm();
  const { contextMenu, handleContextMenu, closeMenu, menuRef } = useContextMenu<
    any,
    HTMLUListElement
  >();

  useEffect(() => {
    if (!mode) return;
    const map: Record<string, () => void> = {
      All: () => getFriends({}),
      "My Invite": () => getInvMe({}),
      Invite: () => getInvI({}),
      Online: () => getFriends({}),
      Offline: () => getFriends({}),
      Blocked: () => getFriends({}),
    };
    map[mode]?.();
  }, [mode]);

  useEffect(() => {
    if (confirmSuccess || confirmReject) dispatch(setFriendMode(mode));
  }, [confirmSuccess, confirmReject]);

  const filteredFriends = useMemo(() => {
    if (!friends) return [];
    return friends.filter((f) => {
      const isOnline = onlineUsers.includes(f.id);
      const isBlocked = f.is_blocked;
      switch (mode) {
        case "Online":
          return !isBlocked && isOnline;
        case "Offline":
          return !isBlocked && !isOnline;
        case "Blocked":
          return isBlocked;
        case "All":
          return !isBlocked;
        default:
          return true;
      }
    });
  }, [friends, onlineUsers, mode]);

  const handleClick = (id: string) => trigger(id);
  const handleStartChat = async (userId: string) => {
    try {
      await startChat(userId).unwrap();
    } catch (err) {
      console.error(err);
    } finally {
      closeMenu();
    }
  };

  const handleRemoveFriend = async (userId: string) => {
    const ok = await confirm(t("confirm.remove"));
    if (!ok) return;
    await removeFriend(userId).unwrap().catch(console.error);
    dispatch(setFriendMode(mode));
    closeMenu();
  };

  const handleBlockFriend = async (userId: string) => {
    const ok = await confirm(t("confirm.block"));
    if (!ok) return;
    await blockFriend(userId).unwrap().catch(console.error);
    dispatch(setFriendMode(mode));
    closeMenu();
  };

  const handleUnblockFriend = async (userId: string) => {
    const ok = await confirm(t("confirm.unblock"));
    if (!ok) return;
    await unblockFriend(userId).unwrap().catch(console.error);
    dispatch(setFriendMode(mode));
    closeMenu();
  };

  return {
    t,
    mode,
    filteredFriends,
    confirmFriend,
    reject,
    handleClick,
    handleContextMenu,
    handleStartChat,
    handleRemoveFriend,
    handleBlockFriend,
    handleUnblockFriend,
    contextMenu,
    closeMenu,
    menuRef,
    dispatch,
    modal,
  };
}
