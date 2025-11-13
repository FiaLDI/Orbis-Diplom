import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useCreateProjectMutation, useLazyGetIssuesQuery } from "../api";
import { useEmitServerUpdate } from "@/features/server";
import { setOpenProject, toggleIssueMode } from "..";

export function useProjectModel(serverId?: string) {
  const projects = useAppSelector((s) => s.issue.project);
  const dispatch = useAppDispatch();

  const [createProject] = useCreateProjectMutation();
  const [getIssue] = useLazyGetIssuesQuery();
  const emitServerUpdate = useEmitServerUpdate();

  const handlerCreateProject = async () => {
    if (!serverId) return;
    try {
      await createProject({
        serverId: serverId,
        data: { name: "default", description: "default" },
      }).unwrap();

      emitServerUpdate("projects", serverId);
    } catch (err) {
      console.error("Ошибка при создании проекта:", err);
    }
  };

  const open = (id: string) => {
    if (!serverId) return;
    dispatch(setOpenProject(id));

    getIssue({ serverId, projectId: id });
  };

  const handleProject = () => {
    dispatch(toggleIssueMode());
  };

  return {
    handleProject,
    open,
    handlerCreateProject,
    projects,
  };
}
