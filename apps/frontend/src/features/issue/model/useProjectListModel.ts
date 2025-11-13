import { useProjectModel } from "./useProjectModel";

export function useProjectListModel(serverId?: string) {
  const { projects, handleProject, handlerCreateProject, open } =
    useProjectModel(serverId);

  return {
    projects,
    handleProject,
    handlerCreateProject,
    open,
  };
}
