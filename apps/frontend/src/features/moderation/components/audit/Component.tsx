import React, { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  useGetAuditLogsQuery,
  useBanUserMutation,
  useUnbanUserMutation,
  useKickUserMutation,
  useGetBannedUsersQuery 
} from "../../api";
import { X } from "lucide-react";
import { setSettingsActive } from "@/features/server/slice";
import { useLazyGetServersMembersQuery } from "@/features/server";

export const Component: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeserver = useAppSelector((s) => s.server.activeserver);
  const meId = useAppSelector((s) => s.auth.user?.info.id);

  const {
    data: logs = [],
    isFetching,
    refetch,
  } = useGetAuditLogsQuery(
    { serverId: activeserver?.id! },
    { skip: !activeserver?.id },
  );

  const {
    data: bannedUsers = [],
    isFetching: isBannedFetching,
    refetch: bannedRefetch,
  } = useGetBannedUsersQuery(activeserver?.id!, { skip: !activeserver?.id });

  const [banUser] = useBanUserMutation();
  const [unbanUser] = useUnbanUserMutation();
  const [kickUser] = useKickUserMutation();
  const [triggerMembers] = useLazyGetServersMembersQuery();

  const [reasonMap, setReasonMap] = useState<Record<number, string>>({});

  const refreshData = async () => {
    if (!activeserver?.id) return;
    await Promise.all([
      refetch(), // обновить аудит-лог
      triggerMembers(activeserver.id), // обновить участников
    ]);
  };

  const handleBan = async (userId: number) => {
    if (!activeserver?.id || userId === Number(meId)) return;
    const reason = reasonMap[userId]?.trim() || undefined;
    try {
      await banUser({ serverId: activeserver.id, userId, reason }).unwrap();
      await refreshData(); // ✅ обновить данные
    } catch (err: any) {
      console.error("Ban error:", err);
    }
  };

  const handleUnban = async (userId: number) => {
    if (!activeserver?.id || userId === Number(meId)) return;
    try {
      await unbanUser({ serverId: activeserver.id, userId }).unwrap();
      await refreshData(); // ✅ обновить данные
    } catch (err: any) {
      console.error("Unban error:", err);
    }
  };

  const handleKick = async (userId: number) => {
    if (!activeserver?.id || userId === Number(meId)) return;
    try {
      await kickUser({ serverId: activeserver.id, userId }).unwrap();
      await refreshData(); // ✅ обновить данные
    } catch (err: any) {
      console.error("Kick error:", err);
    }
  };

  const sortedLogs = useMemo(
    () =>
      [...(logs ?? [])].sort((a, b) =>
        a.created_at > b.created_at ? -1 : 1,
      ),
    [logs],
  );

  if (!activeserver) return null;

  return (
    <div className="flex flex-col h-full w-full p-5 rounded-[5px] text-white">
      <div className="w-full h-full bg-[#2e3ed328]">
        {/* header */}
        <div className="bg-[#2e3ed34f] w-full rounded flex items-center justify-between p-5">
          <div className="text-lg font-semibold">
            Moderation — {activeserver?.name}
          </div>
          <button
            className="cursor-pointer p-1 rounded hover:bg-white/10"
            onClick={() => dispatch(setSettingsActive(false))}
          >
            <X />
          </button>
        </div>

        {/* Users list */}
        <div className="p-5 flex flex-col gap-3">
          <h4 className="text-2xl">Members</h4>
          {activeserver?.users?.map((user, idx) => {
            const isSelf = user.id === Number(meId);
            return (
              <div
                key={`moderation-user-${idx}`}
                className="flex flex-col gap-2 border-b border-white/20 pb-3"
              >
                <div className="flex gap-3 items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <img
                      src={user.user_profile.avatar_url || "/img/icon.png"}
                      alt=""
                      className="w-10 h-10 rounded"
                    />
                    <div>
                      <div className="font-medium">
                        {user.username}{" "}
                        {isSelf && (
                          <span className="text-xs opacity-70">(это вы)</span>
                        )}
                      </div>
                      <div className="text-xs opacity-70">ID: {user.id}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      disabled={isSelf}
                      className={`px-3 py-1 rounded text-sm ${
                        isSelf
                          ? "opacity-40 cursor-not-allowed bg-gray-700"
                          : "bg-yellow-500/30 hover:bg-yellow-500/50"
                      }`}
                      title={
                        isSelf ? "Нельзя кикнуть самого себя" : "Кикнуть участника"
                      }
                      onClick={() => handleKick(user.id)}
                    >
                      Kick
                    </button>
                    <button
                      disabled={isSelf}
                      className={`px-3 py-1 rounded text-sm ${
                        isSelf
                          ? "opacity-40 cursor-not-allowed bg-gray-700"
                          : "bg-red-500/40 hover:bg-red-500/60"
                      }`}
                      title={
                        isSelf ? "Нельзя забанить самого себя" : "Забанить участника"
                      }
                      onClick={() => handleBan(user.id)}
                    >
                      Ban
                    </button>
                    <button
                      disabled={isSelf}
                      className={`px-3 py-1 rounded text-sm ${
                        isSelf
                          ? "opacity-40 cursor-not-allowed bg-gray-700"
                          : "bg-green-600/40 hover:bg-green-600/60"
                      }`}
                      title={
                        isSelf
                          ? "Нельзя разбанить самого себя"
                          : "Разбанить участника"
                      }
                      onClick={() => handleUnban(user.id)}
                    >
                      Unban
                    </button>
                  </div>
                </div>

                {/* поле причины */}
                <div className="flex gap-2 mt-1">
                  <input
                    disabled={isSelf}
                    type="text"
                    placeholder="Причина (необязательно)"
                    className="flex-1 px-2 py-1 rounded bg-[#1e2a8a]/40 outline-none text-sm placeholder:text-white/40"
                    value={reasonMap[user.id] ?? ""}
                    onChange={(e) =>
                      setReasonMap((prev) => ({
                        ...prev,
                        [user.id]: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Banned users list */}
<div className="p-5 flex flex-col gap-3 border-t border-white/10">
  <h4 className="text-2xl flex items-center justify-between">
    Banned Users
    <button
      onClick={() => bannedRefetch()}
      className="text-sm px-2 py-1 rounded bg-white/10 hover:bg-white/20"
    >
      Обновить
    </button>
  </h4>

  {isBannedFetching && <div className="opacity-60">Загрузка...</div>}
  {!bannedUsers?.length && !isBannedFetching && (
    <div className="opacity-60">Нет забаненных пользователей</div>
  )}

  <div className="max-h-[300px] overflow-y-auto space-y-2">
    {bannedUsers?.map((ban) => (
      <div
        key={`banned-${ban.user_id}`}
        className="flex justify-between items-center p-3 bg-white/5 border border-white/10 rounded"
      >
        <div className="flex gap-3 items-center">
          <img
            src={ban.user.user_profile?.avatar_url || "/img/icon.png"}
            alt=""
            className="w-10 h-10 rounded"
          />
          <div>
            <div className="font-medium">{ban.user.username}</div>
            <div className="text-xs opacity-70">
              Забанен {new Date(ban.created_at).toLocaleString("ru-RU")}
            </div>
            {ban.reason && (
              <div className="text-xs opacity-70 mt-0.5">
                Причина: {ban.reason}
              </div>
            )}
          </div>
        </div>

        <button
          className="px-3 py-1 bg-green-600/40 hover:bg-green-600/60 rounded text-sm"
          onClick={() => handleUnban(ban.user.id)}
        >
          Unban
        </button>
      </div>
    ))}
  </div>
</div>


        {/* Audit logs */}
        <div className="p-5 flex flex-col gap-3">
          <h4 className="text-2xl flex items-center justify-between">
            Audit Log
            <button
              onClick={() => refetch()}
              className="text-sm px-2 py-1 rounded bg-white/10 hover:bg-white/20"
            >
              Обновить
            </button>
          </h4>

          {isFetching && <div className="opacity-60">Загрузка...</div>}
          {!sortedLogs.length && !isFetching && (
            <div className="opacity-60">Нет записей аудита</div>
          )}

          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {sortedLogs.map((log) => (
              <div
                key={log.id}
                className="rounded bg-white/5 p-3 border border-white/10"
              >
                <div className="text-sm opacity-70">
                  {new Date(log.created_at).toLocaleString("ru-RU")}
                </div>
                <div className="text-sm mt-1">
                  <b>{log.actor?.username ?? `User#${log.actor_id}`}</b>{" "}
                  {log.action === "BAN_ADD" && "забанил"}
                  {log.action === "BAN_REMOVE" && "разбанил"}
                  {log.action === "KICK" && "выгнал"}
                  {" пользователя "}
                  <b>{log.target_id ? `User#${log.target_id}` : "-"}</b>
                </div>
                {log.metadata &&
                  (() => {
                    try {
                      const meta = JSON.parse(log.metadata);
                      return meta?.reason ? (
                        <div className="text-xs opacity-70 mt-1">
                          Причина: {meta.reason}
                        </div>
                      ) : null;
                    } catch {
                      return null;
                    }
                  })()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
