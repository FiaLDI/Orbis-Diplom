import React, { useState, useEffect } from "react";
import { ModalLayout } from "@/components/layout/Modal/Modal";
import {
  useGetPermissionsQuery,
  useGetRolePermissionsQuery,
  useUpdateRolePermissionsMutation,
  useUpdateServerRoleMutation,
} from "@/features/server";

interface Props {
  roleId: number;
  roleName: string;
  roleColor?: string;
  serverId: number;
}

export const Component: React.FC<Props> = ({ roleId, serverId, roleName, roleColor }) => {
  const { data: allPermissions = [] } = useGetPermissionsQuery({});
  const { data: rolePermissionsData = [] } = useGetRolePermissionsQuery(roleId);

  const [updateRolePermissions, { isLoading }] = useUpdateRolePermissionsMutation();
  const [updateServerRole, { isLoading: isUpdatingRole }] = useUpdateServerRoleMutation();

  const [open, setOpen] = useState(false);
  const [rolePermissions, setRolePermissions] = useState<number[]>([]);
  const [name, setName] = useState(roleName);
  const [color, setColor] = useState(roleColor || "#5865F2")

  useEffect(() => {
    if (rolePermissionsData.length > 0) {
      const newIds = rolePermissionsData.map((p: any) => p.id);
      if (JSON.stringify(newIds) !== JSON.stringify(rolePermissions)) {
        setRolePermissions(newIds);
      }
    }
  }, [rolePermissionsData]);

  const togglePermission = (pid: number) => {
    setRolePermissions((prev) =>
      prev.includes(pid) ? prev.filter((id) => id !== pid) : [...prev, pid]
    );
  };

  const save = async () => {
    if (roleName.toLowerCase() === "creator") {
      return;
    }

    await updateServerRole({ roleId, serverId, data: { name, color } });
    if (roleName.toLowerCase() !== "creator") {
      await updateRolePermissions({ roleId, permissions: rolePermissions });
    }
    setOpen(false);
  };
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="cursor-pointer px-3 py-1 bg-[#2e3ed328] rounded text-sm"
        style={{ color }}
      >
        Edit
      </button>

      <ModalLayout open={open} onClose={() => setOpen(false)}>
        <div className="p-0">
          <h4 className="text-lg font-semibold px-30 py-3 bg-[#4354ee8f] rounded text-center">Role editor</h4>
          <div>
            <label className="block text-sm font-medium mb-1">Role name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-2 py-1"
              disabled={["creator", "default"].includes(roleName.toLowerCase())}
            />
          </div>

          {/* Цвет роли */}
          <div>
            <label className="block text-sm font-medium mb-1">Role color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-16 h-10 cursor-pointer border rounded"
            />
          </div>

          {/* Permissions */}
          <div className="">
            {roleName.toLowerCase() === "creator" ? (
              <div className="text-sm text-gray-400">Permissions cannot be changed for creator</div>
            ) : (
              allPermissions.map((perm: any) => (
                <div key={perm.id} className="flex justify-between items-center">
                  <span>{perm.name}</span>
                  <input
                    type="checkbox"
                    checked={rolePermissions.includes(perm.id)}
                    onChange={() => togglePermission(perm.id)}
                  />
                </div>
              ))
            )}
          </div>

          {/* Save button */}
          <button
            onClick={save}
            disabled={isLoading || isUpdatingRole}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading || isUpdatingRole ? "Saving..." : "Save"}
          </button>
        </div>
      </ModalLayout>
    </>
  );
};
