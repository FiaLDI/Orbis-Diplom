import { useForm } from "react-hook-form";
import {
  useAssignRoleToMemberMutation,
  useRemoveRoleFromMemberMutation,
} from "@/features/server/api";

export function useAssignRolesModalModel(
  serverId: string,
  userId: string,
  userRoles: { id: string }[],
  emitServerUpdate: (type: any, serverId: string) => void,
  onClose?: () => void,
) {
  const [assignRole] = useAssignRoleToMemberMutation();
  const [removeRole] = useRemoveRoleFromMemberMutation();

  const form = useForm<{ roles: string[] }>({
    defaultValues: { roles: userRoles.map((r) => r.id) },
  });

  const { handleSubmit, watch, setValue } = form;
  const selected = watch("roles");

  const toggleRole = (roleId: string) => {
    const cur = selected || [];
    setValue(
      "roles",
      cur.includes(roleId) ? cur.filter((r) => r !== roleId) : [...cur, roleId],
    );
  };

  const onSubmit = async (data: { roles: string[] }) => {
    const toAdd = data.roles.filter(
      (id) => !userRoles.some((r) => r.id === id),
    );
    const toRemove = userRoles
      .map((r) => r.id)
      .filter((id) => !data.roles.includes(id));

    for (const id of toAdd) {
      await assignRole({ serverId, userId, roleId: id })
        .unwrap()
        .catch(() => {});
    }
    for (const id of toRemove) {
      await removeRole({ serverId, userId, roleId: id })
        .unwrap()
        .catch(() => {});
    }

    await emitServerUpdate("settings", serverId);
    onClose?.();
  };

  return { form, toggleRole, onSubmit };
}
