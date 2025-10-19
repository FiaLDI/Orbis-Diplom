import React, { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  Unlock,
  Menu,
  MessageSquare,
  UserMinus,
  Ban,
  Lock,
  CirclePlus,
  CircleMinus,
} from "lucide-react";
import { DefaultButton } from "@/shared/ui";
import { useLazyGetInfoUserQuery, useStartChattingMutation } from "@/features/user";
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
} from "../..";
import { setFriendMode } from "../../slice";
import { Component as SearchFriends } from "./SearchFriends";
import { AnimatedContextMenu, useContextMenu } from "@/features/shared";
import clsx from "clsx";

export const Component: React.FC = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((s) => s.friends.friendsMode);
  const friends = useAppSelector((s) => s.friends.friends);
  const onlineUsers = useAppSelector((s) => s.notification.onlineUsers);

  const [trigger] = useLazyGetInfoUserQuery();
  const [getFriends] = useLazyGetFriendQuery();
  const [getInvI] = useLazyGetOutcomingRequestsQuery();
  const [getInvMe] = useLazyGetIncomingRequestsQuery();
  const [confirm, { isSuccess: confirmSuccess }] = useConfirmFriendRequestMutation();
  const [reject, { isSuccess: confirmReject }] = useRejectFriendRequestMutation();
  const [unblockFriend] = useUnblockFriendMutation();
  const [removeFriend] = useRemoveFriendMutation();
  const [blockFriend] = useBlockFriendMutation();
  const [startChat] = useStartChattingMutation();

  const {} = useGetFriendQuery({});
  const { contextMenu, handleContextMenu, closeMenu, menuRef } =
    useContextMenu<any, HTMLUListElement>();

  const handleClick = (id: number) => trigger(id);

  useEffect(() => {
    if (!mode) return;
    const modeActions: Record<string, () => void> = {
      All: () => getFriends({}),
      "My Invite": () => getInvMe({}),
      Invite: () => getInvI({}),
      Online: () => getFriends({}),
      Offline: () => getFriends({}),
      Blocked: () => getFriends({}),
    };
    const action = modeActions[mode];
    if (action) action();
  }, [mode]);

  useEffect(() => {
    if (confirmSuccess || confirmReject) dispatch(setFriendMode(mode));
  }, [confirmSuccess, confirmReject]);

  // 🔍 фильтрация
  const filteredFriends = useMemo(() => {
    if (!friends) return [];
    return friends.filter((f) => {
      const isOnline = onlineUsers.includes(f.id);
      const isBlocked = f.is_blocked === true;

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

  // ⚙️ контекстное меню
  const handleStartChat = async (userId: number) => {
    try {
      const chat = await startChat(userId).unwrap();
      console.log("💬 Чат создан:", chat);
    } catch (err) {
      console.error("Ошибка создания чата:", err);
    } finally {
      closeMenu();
    }
  };

  const handleRemoveFriend = async (userId: number) => {
    if (!confirm("Удалить из друзей?")) return;
    try {
      await removeFriend(userId).unwrap();
      dispatch(setFriendMode(mode));
    } catch (err) {
      console.error("Ошибка удаления:", err);
    } finally {
      closeMenu();
    }
  };

  const handleBlockFriend = async (userId: number) => {
    if (!confirm("Заблокировать пользователя?")) return;
    try {
      await blockFriend(userId).unwrap();
      dispatch(setFriendMode(mode));
    } catch (err) {
      console.error("Ошибка блокировки:", err);
    } finally {
      closeMenu();
    }
  };

  const handleUnblockFriend = async (userId: number) => {
    if (!confirm("Разблокировать пользователя?")) return;
    try {
      await unblockFriend(userId).unwrap();
      dispatch(setFriendMode(mode));
    } catch (err) {
      console.error("Ошибка разблокировки:", err);
    } finally {
      closeMenu();
    }
  };

  const menuItems =
    contextMenu?.data && contextMenu?.data.id
      ? [
          {
            label: "💬 Начать чат",
            action: () => handleStartChat(contextMenu.data.id),
            icon: <MessageSquare size={15} />,
          },
          {
            label: "🗑 Удалить из друзей",
            action: () => handleRemoveFriend(contextMenu.data.id),
            icon: <UserMinus size={15} />,
            danger: true,
          },
          contextMenu.data.is_blocked
            ? {
                label: "🔓 Разблокировать",
                action: () => handleUnblockFriend(contextMenu.data.id),
                icon: <Unlock size={15} />,
              }
            : {
                label: "🚫 Заблокировать",
                action: () => handleBlockFriend(contextMenu.data.id),
                icon: <Ban size={15} />,
                danger: true,
              },
        ]
      : [];

  return (
    <>
      <div className="w-full h-full flex text-white p-5 rounded-[5px] z-10">
        {/* ====== Левая панель ====== */}
        <div className="relative p-5 flex flex-col bg-[#2e3ed34f] items-center rounded-[5px] justify-between lg:justify-normal">
          <h1 className="text-5xl lg:text-base p-5 whitespace-nowrap">Friends</h1>
          <button className="lg:hidden">
            <Menu className="w-15 h-15 lg:w-10 lg:h-10" />
          </button>

          <div className="bg-[#2e3ed3] lg:bg-transparent flex items-center justify-between h-full absolute lg:relative top-15 rounded-[5px] lg:top-0 flex-col p-5 text-5xl lg:p-0 lg:text-base gap-5 w-full">
            <div className="w-full flex flex-col gap-5">
              <DefaultButton handler={() => dispatch(setFriendMode("All"))}>
                All Friends
              </DefaultButton>
              <DefaultButton handler={() => dispatch(setFriendMode("Online"))}>
                Online Friends
              </DefaultButton>
              <DefaultButton handler={() => dispatch(setFriendMode("Offline"))}>
                Offline Friends
              </DefaultButton>
              <DefaultButton handler={() => dispatch(setFriendMode("Invite"))}>
                Sent Invites
              </DefaultButton>
              <DefaultButton handler={() => dispatch(setFriendMode("My Invite"))}>
                Received Invites
              </DefaultButton>
              <DefaultButton handler={() => dispatch(setFriendMode("Blocked"))}>
                Blocked Friends <Lock className="inline ml-2" size={16} />
              </DefaultButton>
            </div>
            <SearchFriends />
          </div>
        </div>

        {/* ====== Список ====== */}
        <ul className="bg-[#25309b88] h-full w-full flex flex-col gap-5 p-5 rounded-b-[5px] overflow-y-auto">
          {filteredFriends?.length ? (
            filteredFriends.map((val) => {
              const avatar = val.avatar_url || "/img/icon.png";
              const isOnline = onlineUsers.includes(val.id);
              const isBlocked = val.is_blocked === true;

              return (
                <li
                  key={`friend-${val.id}-${val.username}`}
                  className={clsx(
                    "flex items-center justify-between p-2 rounded-md transition bg-[#4b58cc66] hover:bg-[#5e6aff99]",
                    isBlocked && "opacity-60 pointer-events-none"
                  )}
                  onContextMenu={(e) => handleContextMenu(e, val)}
                >
                  <div
                    className="flex gap-3 items-center cursor-pointer w-full"
                    onClick={() => handleClick(val.id)}
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
                            : "bg-gray-600"
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

                  {/* ✅ кнопки для подтверждения / отклонения приглашения */}
                  {mode === "My Invite" && (
                    <div className="flex gap-2">
                      <button
                        className="cursor-pointer hover:text-green-400"
                        onClick={() => confirm(val.id)}
                      >
                        <CirclePlus
                          className="w-15 h-15 lg:w-8 lg:h-8"
                          strokeWidth={"1.25"}
                        />
                      </button>
                      <button
                        className="cursor-pointer hover:text-red-400"
                        onClick={() => reject(val.id)}
                      >
                        <CircleMinus
                          className="w-15 h-15 lg:w-8 lg:h-8"
                          strokeWidth={"1.25"}
                        />
                      </button>
                    </div>
                  )}
                </li>
              );
            })
          ) : (
            <p className="text-center opacity-60">No friends found</p>
          )}
        </ul>
      </div>

      <AnimatedContextMenu
        visible={!!contextMenu}
        x={contextMenu?.x || 0}
        y={contextMenu?.y || 0}
        items={menuItems}
        onClose={closeMenu}
        menuRef={menuRef}
      />
    </>
  );
};
