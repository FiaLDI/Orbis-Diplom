import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  setActiveServer,
  setSettingsActive,
  useCreateLinksMutation,
  useCreateRoleMutation,
  useDeleteLinksMutation,
  useDeleteRoleMutation,
  useDeleteServerMutation,
  useEmitServerUpdate,
  useLazyGetLinksQuery,
  useLazyGetServersQuery,
  useUpdateServerMutation,
} from "@/features/server";
import { uploadFiles } from "@/features/upload";
import { shallowEqual } from "react-redux";

export type ServerSettingsFormData = {
  name: string;
  avatar_url?: string;
};

export function useServerSettingsModel() {
  const dispatch = useAppDispatch();
  const { activeserver, allPermission } = useAppSelector(
    (s) => ({
      activeserver: s.server.activeserver,
      allPermission: s.server.allPermission,
    }),
    shallowEqual,
  );
  const upload = useAppSelector((s) => s.upload);

  const emit = useEmitServerUpdate();

  const [updateServer, updateState] = useUpdateServerMutation();
  const [deleteServer] = useDeleteServerMutation();
  const [createRole] = useCreateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();
  const [getServers] = useLazyGetServersQuery();

  const [createServerLink] = useCreateLinksMutation();
  const [DeleteServerLinks] = useDeleteLinksMutation();

  const form = useForm<ServerSettingsFormData>({
    defaultValues: {
      name: activeserver?.name ?? "",
      avatar_url: activeserver?.avatar_url ?? "",
    },
  });

  const { handleSubmit, register, setValue, watch, formState, reset } = form;

  useEffect(() => {
    reset({
      name: activeserver?.name ?? "",
      avatar_url: activeserver?.avatar_url ?? "",
    });
  }, [activeserver?.id, activeserver?.name, activeserver?.avatar_url, reset]);

  useEffect(() => {
    if (!upload.loading && upload.files?.[0]?.url) {
      setValue("avatar_url", upload.files[0].url, { shouldDirty: true });
    }
  }, [upload.loading, upload.files, setValue]);

  const onPickAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await dispatch(uploadFiles([file]));
  };

  const onCreateRole = async () => {
    if (!activeserver?.id) return;
    await createRole({ id: activeserver.id, data: { name: "custom" } })
      .unwrap()
      .catch(() => {});
    emit("settings", activeserver.id);
  };

  const onDeleteRole = async (roleId: string) => {
    if (!activeserver?.id) return;
    await deleteRole({ serverId: activeserver.id, roleId })
      .unwrap()
      .catch(() => {});
    emit("settings", activeserver.id);
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!activeserver?.id) return;
    await updateServer({
      id: activeserver.id,
      data: { name: data.name, avatar_url: data.avatar_url ?? "" },
    }).unwrap();
    emit("settings", activeserver.id);
  });

  const onCloseSettings = () => dispatch(setSettingsActive(false));

  const onDangerDeleteServer = async () => {
    if (!activeserver?.id) return;
    await deleteServer(activeserver.id)
      .unwrap()
      .catch(() => {});
    await getServers({});
    dispatch(setActiveServer(undefined));
  };

  const roles = useMemo(() => activeserver?.roles ?? [], [activeserver?.roles]);
  const members = useMemo(
    () => activeserver?.users ?? [],
    [activeserver?.users],
  );

  return {
    activeserver,
    allPermission,
    form: {
      register,
      formState,
      watch,
      onSubmit,
      onPickAvatar,
      updateState,
      uploadLoading: upload.loading,
      uploadProgress: upload.overallProgress,
    },
    ui: {
      onCloseSettings,
      onDangerDeleteServer,
      onCreateRole,
      onDeleteRole,
      emit,
    },
    lists: { roles, members },
    invites: { createServerLink, DeleteServerLinks },
  };
}
