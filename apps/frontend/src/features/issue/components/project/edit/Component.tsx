import React, { useState } from "react";
import { ModalLayout } from "@/shared";
import { Props } from "./interface";
import { useDeleteProjectMutation, useUpdateProjectMutation } from "@/features/issue";
import { Ellipsis } from "lucide-react";
import { useEmitServerUpdate } from "@/features/server";


export const Component: React.FC<Props> = ({ projectId, serverId, projectName, projectDescription }) => {

  const [open, setOpen] = useState(false);
  const [name, setName] = useState(projectName);
  const [description, setDescription] = useState(projectDescription);

  const [updateProject] = useUpdateProjectMutation();
  const [removeProject] = useDeleteProjectMutation();

  const emitServerUpdate = useEmitServerUpdate();

  const save = async () => {
    if (!name.trim() || !description.trim()) return;

    try {
      await updateProject({ projectId, serverId, data: { name, description } }).unwrap();
      emitServerUpdate(serverId);
      setOpen(false);
    } catch (err) {
      console.error("Ошибка при обновлении проекта:", err);
    }
  };

  const rem = async () => {
    try {
      await removeProject({ serverId, projectId }).unwrap();
      emitServerUpdate(serverId); // ✅
      setOpen(false);
    } catch (err) {
      console.error("Ошибка при удалении проекта:", err);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="cursor-pointer p-5 rounded text-sm hover:text-black"
      >
        <Ellipsis />
      </button>

      <ModalLayout open={open} onClose={() => setOpen(false)}>
        <div className="p-0">
          <h4 className="text-lg font-semibold px-30 py-3 bg-[#4354ee8f] rounded text-center">Project editor</h4>
          <div>
            <label className="block text-sm font-medium mb-1">Project name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div className="">
            <label className="block text-sm font-medium mb-1">Project description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <button
            className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:opacity-50"
            onClick={rem}
          >
            Delete
          </button>
          <button
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            onClick={save}
          >
            Save
          </button>
        </div>
      </ModalLayout>
    </>
  );
};
