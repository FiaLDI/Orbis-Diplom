import React from "react";
import { server } from "@/features/server";
import {
  AuditLayout,
  MembersSection,
  LogsSection,
  BannedSection,
} from "@/features/moderation/ui";
import { useAuditModel } from "@/features/moderation/hooks";

export const Component: React.FC<{ activeserver: server }> = ({
  activeserver,
}) => {
  const {
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
    auditLogsRefetch,
    sortedLogs,
    isBannedFetching,
    bannedUsers,
    isFetching,
  } = useAuditModel(activeserver);

  if (!activeserver) return null;

  return (
    <AuditLayout
      header={
        <>
          <div className="text-lg font-semibold">
            {t("audit.title")} — {activeserver.name}
          </div>
        </>
      }
      members={
        <MembersSection
          title={t("audit.members")}
          users={activeserver.users ?? []}
          meId={meId!}
          reasonMap={reasonMap}
          setReason={(id, v) => setReasonMap((prev) => ({ ...prev, [id]: v }))}
          onKick={handleKick}
          onBan={(id) => handleBan(id)}
          onUnban={handleUnban}
          open={open}
          onToggle={() => setOpen((p) => !p)}
        />
      }
      banned={
        <BannedSection
          title={t("audit.banned.title")}
          refreshingLabel={t("audit.banned.refresh")}
          loading={isBannedFetching}
          items={bannedUsers ?? []}
          onRefresh={bannedRefetch}
          onUnban={handleUnban}
          emptyLabel={t("audit.banned.nobanned")}
        />
      }
      logs={
        <LogsSection
          title={t("audit.logs.title")}
          loading={isFetching}
          items={sortedLogs}
          onRefresh={auditLogsRefetch}
          emptyLabel={t("audit.logs.nologs")}
        />
      }
    />
  );
};
