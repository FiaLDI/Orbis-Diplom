import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useLazyGetIssuesQuery,
  useUpdateProjectMutation,
} from "../api";
import { useEmitServerUpdate } from "@/features/server";
import { setOpenProject, toggleIssueMode } from "..";
import { useState } from "react";
import { ProjectEditFormData } from "../components/project/edit/interface";
import { SubmitHandler, useForm } from "react-hook-form";
import { Props } from "../components/project/edit/interface";

export function useProjectEditModel({
  projectId,
  serverId,
  projectName,
  projectDescription,
}: Props) {
  const [open, setOpen] = useState(false);
  const emitServerUpdate = useEmitServerUpdate();
  const [updateProject, updateState] = useUpdateProjectMutation();
  const [removeProject, removeState] = useDeleteProjectMutation();

  const form = useForm<ProjectEditFormData>({
    defaultValues: {
      name: projectName || "",
      description: projectDescription || "",
    },
  });

  const onSubmit: SubmitHandler<ProjectEditFormData> = async (data) => {
    if (!data.name.trim() || !data.description.trim()) return;

    try {
      await updateProject({ projectId, serverId, data }).unwrap();
      emitServerUpdate("projects", serverId);
      setOpen(false);
    } catch (err) {
      console.error("Ошибка при обновлении проекта:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await removeProject({ serverId, projectId }).unwrap();
      emitServerUpdate("projects", serverId);
      setOpen(false);
    } catch (err) {
      console.error("Ошибка при удалении проекта:", err);
    }
  };

  return {
    form,
    onSubmit,
    handleDelete,
    open,
    setOpen,
    updateState,
    removeState,
  };
}
