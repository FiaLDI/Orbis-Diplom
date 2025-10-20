import React, { useState } from "react";
import { ModalInput, ModalLayout } from "@/shared";
import { Props } from "./interface";
import { useDeleteProjectMutation, useUpdateProjectMutation } from "@/features/issue";
import { Ellipsis, X } from "lucide-react";
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
      emitServerUpdate(serverId);
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
        <div className="p-0 w-[400px]">
          <div 
                className="bg-background w-full rounded flex items-center justify-baseline p-5"
            >
                <div className="w-full">Project editor</div>
                <button 
                    className="cursor-pointer p-0 w-fit" 
                    onClick={()=> {
                        setOpen(prev => !prev)
                    }}>
                        <X />
                </button>
            </div>
            <div className="p-5">
          <div>
            <label className="p-3 block">Project name</label>
            <ModalInput
              placeHolder="Enter project name"
              name="projectname"
              value={name}
              change={(e) =>
                  setName((e.target as HTMLInputElement).value)
              }
          />
          </div>

          <div className="">
            <label className="p-3 block">Project description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-2 py-1 bg-transparent"
            />
          </div>
            <div className="flex gap-5">
                  <button
                  className="mt-4 w-full bg-background/80 text-white py-2 rounded hover:bg-background disabled:opacity-50"
                  onClick={rem}
                >
                  Delete
                </button>
                <button
                  className="mt-4 w-full bg-background/80 text-white py-2 rounded hover:bg-background disabled:opacity-50"
                  onClick={save}
                >
                  Save
                </button>
            </div>
          </div>
        </div>
      </ModalLayout>
    </>
  );
};
