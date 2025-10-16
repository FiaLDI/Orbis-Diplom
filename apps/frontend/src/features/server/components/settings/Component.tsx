import React from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Component as PermissionComponent } from "./permission";
import { Component as AssignRolesButton } from "./assignroles";
import {
  setSettingsActive,
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useGetServersRolesQuery,
} from "../..";
import { Plus, X } from "lucide-react";

export const Component: React.FC = () => {
  const { activeserver } = useAppSelector((s) => ({
    activeserver: s.server.activeserver,
  }));

  const dispatch = useAppDispatch();

  const [createRole] = useCreateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

  const { data: roles = [], refetch } = useGetServersRolesQuery(
    activeserver?.id,
    { skip: !activeserver?.id }
  );

  const handleCreateRole = async () => {
    if (!activeserver?.id) return;
    await createRole({ id: activeserver.id, data: { name: "custom" } });
    await refetch(); // 👈 обновляем список ролей
  };

  const handleDeleteRole = async (roleId: number) => {
    if (!activeserver?.id) return;
    await deleteRole({ serverId: activeserver.id, roleId });
    await refetch(); // 👈 обновляем список ролей
  };

  if (!activeserver) return null;

  return (
    <div className="flex flex-col h-full w-full p-5 rounded-[5px] lg:h-screen text-white">
      <div className="w-full h-full bg-[#2e3ed328]">
         <div className="bg-[#2e3ed34f] w-full rounded flex items-center justify-baseline p-5">
                  <div className="w-full">Settings {activeserver?.name}</div>
                  <button className="cursor-pointer p-0 w-fit" onClick={()=> dispatch(setSettingsActive(false))}><X /></button>
                </div>
              <div className="p-5"></div>

        {/* --- Members --- */}
        <div className="p-5">
          <h4 className="text-2xl">Members</h4>
          {activeserver?.users?.map((user, idx) => (
            <div
              key={`member-server-${idx}`}
              className="flex w-full gap-5 items-center justify-between"
            >
                <div className="flex w-full gap-5 items-center ">
              <img
                src={user.user_profile.avatar_url ? user.user_profile.avatar_url :"/img/icon.png"}
                alt=""
                className="shrink-0 w-[40px] h-[40px]"
              />
              <div className=" ">
              {user.username}
                </div>
              {/* текущие роли */}
              <div className="flex gap-2">
                {user?.user_server?.flatMap((us) =>
                  us?.roles?.map((role, index) => (
                    <span
                      key={`role-${index}-${role.id}`}
                      className="px-2 py-0.5 rounded text-xs"
                      style={{ backgroundColor: role.color || "#2e3ed328" }}
                    >
                      {role.name}
                    </span>
                  ))
                )}
              </div>
              </div>

              {/* кнопка изменения ролей */}
              <AssignRolesButton
                userId={user.id}
                serverId={activeserver.id}
                availableRoles={roles.map((r: any) => ({
                  id: Number(r.id),
                  name: r.name,
                  color: r.color,
                }))}
                userRoles={user.user_server
                  .flatMap((us) => us.roles)
                  .map((r) => ({
                    id: Number(r.id),
                    name: r.name,
                  }))}
              />
            </div>
          ))}
        </div>

        {/* --- Roles --- */}
        <div className="p-5 flex flex-col w-full gap-5">
          <div className="w-full flex gap-5 items-center">
            <h4 className="text-2xl">Roles</h4>
            <button
              className="cursor-pointer px-1 py-1 bg-[#2e3ed328] rounded-full"
              onClick={handleCreateRole}
            >
              <Plus />
            </button>
          </div>
          <div className="w-full flex flex-col">
          {roles.map((role: any, index: number) => (
            <div
              key={`roles-${index}`}
              className="flex w-full items-center justify-between border-b border-white/30 p-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className="px-3 py-1 rounded text-sm"
                  style={{ backgroundColor: role.color || "#2e3ed328" }}
                >
                  {role.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <PermissionComponent
                  roleId={Number(role.id)}
                  roleName={role.name}
                  serverId={Number(activeserver.id)}
                  
                />
                <button
                  onClick={() => handleDeleteRole(Number(role.id))}
                  className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 text-sm"
                  disabled={role.name === "creator" || role.name === "default"}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};
