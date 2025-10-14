import React, { useState } from "react";
import { ModalLayout } from "@/components/layout/Modal/Modal";
import {
  useAssignRoleToMemberMutation,
  useRemoveRoleFromMemberMutation,
} from "@/features/server";
import { ComponentProps } from "./interface";


export const Component: React.FC<ComponentProps> = ({
  userId,
  serverId,
  availableRoles,
  userRoles,
}) => {
  const [open, setOpen] = useState(false);
  const [assignRole] = useAssignRoleToMemberMutation();
  const [removeRole] = useRemoveRoleFromMemberMutation();

  const [localRoles, setLocalRoles] = useState<Set<number>>(
    new Set(userRoles.map((r) => r.id))
  );

  const toggleRole = async (roleId: number) => {
    const isAssigned = localRoles.has(roleId);

    setLocalRoles((prev) => {
      const copy = new Set(prev);
      if (isAssigned) copy.delete(roleId);
      else copy.add(roleId);
      return copy;
    });

    try {
      if (isAssigned) {
        await removeRole({ serverId, userId, roleId }).unwrap();
      } else {
        await assignRole({ serverId, userId, roleId }).unwrap();
      }
    } catch (err) {
      console.error("toggleRole error:", err);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1 text-sm rounded bg-[#4354ee8f] hover:bg-[#2e3ed3] cursor-pointer whitespace-nowrap"
      >
        Manage roles
      </button>

      <ModalLayout open={open} onClose={() => setOpen(false)}>
        <div className="p-0">
          <h3 className="text-lg font-semibold px-10 py-3 bg-[#4354ee8f] rounded">Assign roles</h3>

          {availableRoles
            .filter((role) => role.name.toLowerCase() !== "creator")
            .map((role) => (
              <div key={role.id} className="flex justify-between items-center p-3 border-b border-white/30">
                <span style={{ color: role.color || "white" }}>{role.name}</span>
                <input
                  type="checkbox"
                  checked={localRoles.has(role.id)}
                  onChange={() => toggleRole(role.id)}
                />
              </div>
          ))}

          <button
            onClick={() => setOpen(false)}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Done
          </button>
        </div>
      </ModalLayout>
    </>
  );
};
