import { useAppSelector } from "@/app/hooks";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useBanUserMutation,
  useGetAuditLogsQuery,
  useGetBannedUsersQuery,
  useKickUserMutation,
  useUnbanUserMutation,
} from "@/features/moderation/api";
import { server, useLazyGetServersMembersQuery } from "@/features/server";

export const useAuditModel = (activeserver: server) => {
  const { t } = useTranslation("moderation");
  const [open, setOpen] = useState<boolean>(false);
  const meId = useAppSelector((s) => s.auth.user?.info.id);

  const {
    data: logs = [],
    isFetching,
    refetch: auditLogsRefetch,
  } = useGetAuditLogsQuery(activeserver?.id!, { skip: !activeserver?.id });

  const {
    data: bannedUsers = [],
    isFetching: isBannedFetching,
    refetch: bannedRefetch,
  } = useGetBannedUsersQuery(activeserver?.id!, { skip: !activeserver?.id });

  const [banUser] = useBanUserMutation();
  const [unbanUser] = useUnbanUserMutation();
  const [kickUser] = useKickUserMutation();
  const [triggerMembers] = useLazyGetServersMembersQuery();

  const [reasonMap, setReasonMap] = useState<Record<string, string>>({});

  const refreshData = async () => {
    if (!activeserver?.id) return;
    await Promise.all([auditLogsRefetch(), triggerMembers(activeserver.id)]);
  };

  const handleBan = async (userId: string) => {
    if (!activeserver?.id || userId === meId) return;
    const reason = reasonMap[userId]?.trim() || undefined;
    try {
      await banUser({ serverId: activeserver.id, userId, reason }).unwrap();
      await refreshData();
    } catch (err: any) {
      console.error("Ban error:", err);
    }
  };

  const handleUnban = async (userId: string) => {
    if (!activeserver?.id || userId === meId) return;
    try {
      await unbanUser({ serverId: activeserver.id, userId }).unwrap();
      await refreshData();
    } catch (err: any) {
      console.error("Unban error:", err);
    }
  };

  const handleKick = async (userId: string) => {
    if (!activeserver?.id || userId === meId) return;
    try {
      await kickUser({ serverId: activeserver.id, userId }).unwrap();
      await refreshData();
    } catch (err: any) {
      console.error("Kick error:", err);
    }
  };

  const sortedLogs = useMemo(
    () =>
      [...(logs ?? [])].sort((a, b) => (a.created_at > b.created_at ? -1 : 1)),
    [logs],
  );

  return {
    reasonMap,
    setReasonMap,
    meId,
    t,
    open,
    setOpen,
    handleBan,
    handleKick,
    handleUnban,
    bannedRefetch,
    sortedLogs,
    isBannedFetching,
    bannedUsers,
    isFetching,
    auditLogsRefetch,
  };
};
