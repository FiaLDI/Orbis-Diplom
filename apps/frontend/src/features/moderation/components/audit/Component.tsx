import React, { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  useGetAuditLogsQuery,
  useBanUserMutation,
  useUnbanUserMutation,
  useKickUserMutation,
  useGetBannedUsersQuery 
} from "../../api";
import { useLazyGetServersMembersQuery } from "@/features/server";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Component: React.FC = () => {
  const { t } = useTranslation("moderation");
  const [open, setOpen] = useState<boolean>(false);
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
    <div className="flex flex-col h-full w-full p-0 rounded-[5px] text-white">
      <div className="w-full h-full bg-background/50">
        {/* header */}
        <div className="bg-foreground w-full rounded flex items-center justify-between p-5">
          <div className="text-lg font-semibold">
            {t("audit.title")} — {activeserver?.name}
          </div>
          <button onClick={()=>setOpen(prev => !prev)}>
            <ChevronDown />
          </button>
        </div>
        {open ? 
          <div className="">
            {/* Users list */}
        <div className="p-5 flex flex-col gap-3">
          <h4 className="text-2xl">{t("audit.members")}</h4>
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
                          <span className="text-xs opacity-70">({t("audit.itsyou")})</span>
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
                        isSelf ? t("audit.action.kick.titleyourself") : t("audit.action.kick.title")
                      }
                      onClick={() => handleKick(user.id)}
                    >
                      {t("audit.action.kick.submit")}
                    </button>
                    <button
                      disabled={isSelf}
                      className={`px-3 py-1 rounded text-sm ${
                        isSelf
                          ? "opacity-40 cursor-not-allowed bg-gray-700"
                          : "bg-red-500/40 hover:bg-red-500/60"
                      }`}
                      title={
                        isSelf ? t("audit.action.ban.titleyourself") : t("audit.action.ban.title")
                      }
                      onClick={() => handleBan(user.id)}
                    >
                      {t("audit.action.ban.submit")}
                    </button>
                    <button
                      disabled={isSelf}
                      className={`px-3 py-1 rounded text-sm ${
                        isSelf
                          ? "opacity-40 cursor-not-allowed bg-gray-700"
                          : "bg-green-600/40 hover:bg-green-600/60"
                      }`}
                      title={
                        isSelf ? t("audit.action.unban.titleyourself") : t("audit.action.unban.title")
                      }
                      onClick={() => handleUnban(user.id)}
                    >
                      {t("audit.action.unban.submit")}
                    </button>
                  </div>
                </div>

                {/* поле причины */}
                <div className="flex gap-2 mt-1">
                  <input
                    disabled={isSelf}
                    type="text"
                    placeholder={t("audit.reason")}
                    className="flex-1 px-2 py-1 rounded bg-foreground/50 outline-none text-sm placeholder:text-white/40"
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

        <div className="p-5 flex flex-col gap-3 border-t border-white/10">
          <h4 className="text-2xl flex items-center justify-between">
            {t("audit.banned.title")}
            <button
              onClick={() => bannedRefetch()}
              className="text-sm px-2 py-1 rounded bg-white/10 hover:bg-white/20"
            >
              {t("audit.banned.refresh")}
            </button>
          </h4>

  {isBannedFetching && <div className="opacity-60">{t("audit.banned.loading")}</div>}
  {!bannedUsers?.length && !isBannedFetching && (
    <div className="opacity-60">{t("audit.banned.nobaning")}</div>
  )}

  <div className="max-h-[300px] overflow-y-auto scroll-hidden">
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
              {t("audit.banned.time")} {new Date(ban.created_at).toLocaleString("ru-RU")}
            </div>
            {ban.reason && (
              <div className="text-xs opacity-70 mt-0.5">
                {t("audit.banned.reason")}{ban.reason}
              </div>
            )}
          </div>
        </div>

        <button
          className="px-3 py-1 bg-green-600/40 hover:bg-green-600/60 rounded text-sm"
          onClick={() => handleUnban(ban.user.id)}
        >
          {t("audit.action.unban.submit")}
        </button>
      </div>
    ))}
  </div>
        </div>


        <div className="p-5 flex flex-col gap-3">
          <h4 className="text-2xl flex items-center justify-between">
            {t("audit.logs.title")}
            <button
              onClick={() => refetch()}
              className="text-sm px-2 py-1 rounded bg-white/10 hover:bg-white/20"
            >
              {t("audit.logs.refresh")}
            </button>
          </h4>

          {isFetching && <div className="opacity-60">{t("audit.logs.loading")}</div>}
          {!sortedLogs.length && !isFetching && (
            <div className="opacity-60">{t("audit.logs.nologs")}</div>
          )}

          <div className="max-h-[300px] overflow-y-auto  scroll-hidden">
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
                  {log.action === "BAN_ADD" && t("audit.logs.action.BAN_ADD")}
                  {log.action === "BAN_REMOVE" && t("audit.logs.action.BAN_REMOVE")}
                  {log.action === "KICK" && t("audit.logs.action.KICK")}
                  {` ${t("audit.logs.user")} `}
                  <b>{log.target_id ? `User#${log.target_id}` : "-"}</b>
                </div>
                {log.metadata &&
                  (() => {
                    try {
                      const meta = JSON.parse(log.metadata);
                      return meta?.reason ? (
                        <div className="text-xs opacity-70 mt-1">
                          {t("audit.banned.reason")}{meta.reason}
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
        : null}
        
      </div>
    </div>
  );
};
