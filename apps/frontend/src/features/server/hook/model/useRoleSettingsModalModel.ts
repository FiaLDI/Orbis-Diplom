import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useGetRolePermissionsQuery,
  useUpdateRolePermissionsMutation,
  useUpdateServerRoleMutation,
} from "@/features/server";
import { RoleSettingsFormData } from "@/features/server/types";

export function useRoleSettingsModalModel(
  roleId: string,
  roleName: string,
  roleColor: string | undefined,
  serverId: string,
  emitServerUpdate: (type: any, serverId: string) => void,
  onClose?: () => void,
) {
  const {
    data: rolePerms = [],
    refetch,
    isFetching,
  } = useGetRolePermissionsQuery({ roleId, serverId }, { skip: !roleId });

  const [updateRolePermissions, updatePermState] =
    useUpdateRolePermissionsMutation();
  const [updateServerRole, updateRoleState] = useUpdateServerRoleMutation();

  const form = useForm<RoleSettingsFormData>({
    defaultValues: {
      name: roleName || "",
      color: roleColor || "#5865F2",
      permissions: [],
    },
  });

  const { register, handleSubmit, setValue, watch, formState, reset } = form;

  useEffect(() => {
    reset({
      name: roleName || "",
      color: roleColor || "#5865F2",
      permissions: [],
    });
  }, [roleId, roleName, roleColor, reset]);

  useEffect(() => {
    if (rolePerms && Array.isArray(rolePerms)) {
      setValue(
        "permissions",
        rolePerms.map((p: any) => p.id),
      );
    }
  }, [rolePerms, setValue]);

  const togglePermission = (pid: number) => {
    const current = watch("permissions") || [];
    setValue(
      "permissions",
      current.includes(pid)
        ? current.filter((id: number) => id !== pid)
        : [...current, pid],
    );
  };

  const onOpen = () => refetch();

  const onSubmit = handleSubmit(async (data) => {
    if (roleName.toLowerCase() === "creator") return;
    await updateServerRole({
      roleId,
      serverId,
      data: { name: data.name, color: data.color },
    }).unwrap();
    emitServerUpdate("settings", serverId);

    if (roleName.toLowerCase() !== "creator") {
      await updateRolePermissions({
        serverId,
        roleId,
        permissions: data.permissions,
      }).unwrap();
      emitServerUpdate("settings", serverId);
    }

    onClose?.();
  });

  return {
    query: { isFetching },
    mutation: { updateRoleState, updatePermState },
    form: { register, watch, formState, togglePermission, onSubmit, onOpen },
  };
}
