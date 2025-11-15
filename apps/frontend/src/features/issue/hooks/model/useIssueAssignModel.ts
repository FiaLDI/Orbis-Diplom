import { useState, useCallback } from "react";
import {
  useAssignUserToIssueMutation,
  useUnassignUserFromIssueMutation,
} from "@/features/issue/api";
import { useAppSelector } from "@/app/hooks";

export function useIssueAssignModel(
  serverId: string,
  projectId: string,
  issue: any,
  emitServerUpdate: any,
) {
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [localAssigned, setLocalAssigned] = useState<string[]>(
    issue?.assignees?.map((a: any) => a.user_id || a.id) || [],
  );

  const membersServer =
    useAppSelector((s) => s.server.activeserver?.users) || [];

  const filteredMembers = membersServer.filter((m: any) =>
    m.username.toLowerCase().includes(search.toLowerCase()),
  );

  const [assignUser] = useAssignUserToIssueMutation();
  const [unassignUser] = useUnassignUserFromIssueMutation();

  const handleAssign = async (userId: string) => {
    setLocalAssigned((prev) => [...new Set([...prev, userId])]);
    setLoadingId(userId);

    try {
      await assignUser({ serverId, issueId: issue.id, userId }).unwrap();
      emitServerUpdate("issues", serverId, projectId, "project");
    } catch (err) {
      setLocalAssigned((prev) => prev.filter((id) => id !== userId));
    } finally {
      setLoadingId(null);
    }
  };

  const handleUnassign = async (userId: string) => {
    setLocalAssigned((prev) => prev.filter((id) => id !== userId));
    setLoadingId(userId);

    try {
      await unassignUser({ serverId, issueId: issue.id, userId }).unwrap();
      emitServerUpdate("issues", serverId, projectId, "project");
    } catch (err) {
      console.error("unassign error:", err);
      setLocalAssigned((prev) => [...prev, userId]);
    } finally {
      setLoadingId(null);
    }
  };
  return {
    search,
    setSearch,
    membersServer,
    filteredMembers,
    handleAssign,
    handleUnassign,
    localAssigned,
    loadingId,
  };
}
