import {
  useCreateIssueMutation,
  useDeleteIssueMutation,
  useLazyGetIssuesQuery,
  useUpdateIssueMutation,
} from "@/features/issue/api";
import { useEmitServerUpdate } from "@/features/server";

export function useIssueQuery(
  serverId?: string,
  projectId?: string,
  closeMenu?: () => void,
) {
  const emitServerUpdate = useEmitServerUpdate();

  const [deleteIssueApi] = useDeleteIssueMutation();
  const [createIssueApi, createState] = useCreateIssueMutation();
  const [updateIssueApi, updateState] = useUpdateIssueMutation();
  const [getIssuesApi] = useLazyGetIssuesQuery();

  const deleteIssue = (issueId: string) => {
    if (!serverId) return;
    if (!projectId) return;

    deleteIssueApi({ serverId, projectId, issueId });
    emitServerUpdate("issues", serverId, projectId, "project");
    closeMenu?.();
  };

  const updateIssue = async (payload: any, issueId: string) => {
    if (!serverId) return;
    await updateIssueApi({
      serverId,
      projectId,
      issueId,
      data: payload,
    });
    emitServerUpdate("issues", serverId, projectId, "project");
  };

  const createIssue = async (payload: any) => {
    if (!serverId) return;
    await createIssueApi({
      serverId,
      projectId,
      data: payload,
    });
    emitServerUpdate("issues", serverId, projectId, "project");
  };

  const getIssues = async () => {
    if (!serverId) return;
    if (!projectId) return;
    await getIssuesApi({ serverId, projectId });
  };

  return {
    createState,
    updateState,
    deleteIssue,
    updateIssue,
    createIssue,
    getIssues,
    emitServerUpdate,
  };
}
