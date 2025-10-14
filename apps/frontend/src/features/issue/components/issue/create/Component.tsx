import React, { useState } from "react";
import { ModalLayout } from "@/components/layout/Modal/Modal";
import { Props } from "./interface";
import { useCreateIssueMutation } from "@/features/issue";
import { Plus } from "lucide-react";
import { useAppSelector } from "@/app/hooks";

export const Component: React.FC<Props> = ({ projectId, serverId, statuses, priorities }) => {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [statusId, setStatusId] = useState<number | null>(null);
  const [priority, setPriority] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<string>("");
  const [parentId, setParentId] = useState<number | null>(null);

  const [createIssue] = useCreateIssueMutation();

  // берем уже существующие issues из стора
  const issues = useAppSelector((s) => s.issue.issues);

  const rem = () => {
    setOpen(false);
    setTitle("");
    setDescription("");
    setStatusId(null);
    setPriority(null);
    setDueDate("");
    setParentId(null);
  };

  const save = async () => {
    if (!title || !statusId || !priority) return;

    try {
      await createIssue({
        id: projectId,
        data: {
          title,
          description,
          statusId,
          priority,
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
          parent_id: parentId || null, // теперь реально связываем
        },
      }).unwrap();

      rem();
    } catch (err) {
      console.error("Failed to create issue:", err);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="cursor-pointer p-5 rounded text-sm hover:text-black"
      >
        <Plus />
      </button>

      <ModalLayout open={open} onClose={() => setOpen(false)}>
        <div className="p-4 text-white space-y-4">
          <h4 className="text-lg font-semibold py-3 bg-[#4354ee8f] rounded text-center">
            Issue creator
          </h4>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Issue title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-2 py-1 text-black"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Issue description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-2 py-1 text-black"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={statusId ?? ""}
              onChange={(e) => setStatusId(Number(e.target.value))}
              className="w-full border rounded px-2 py-1 text-black"
            >
              <option value="">-- Select status --</option>
              {statuses.map((val, idx) => (
                <option key={`status-${idx}`} value={val.id}>
                  {val.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              value={priority ?? ""}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border rounded px-2 py-1 text-black"
            >
              <option value="">-- Select priority --</option>
              {priorities.map((val: any, idx: number) => (
                <option key={`priority-${idx}`} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>

          {/* Due date */}
          <div>
            <label className="block text-sm font-medium mb-1">Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border rounded px-2 py-1 text-black"
            />
          </div>

          {/* Parent issue */}
          <div>
            <label className="block text-sm font-medium mb-1">Parent issue</label>
            <select
              value={parentId ?? ""}
              onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : null)}
              className="w-full border rounded px-2 py-1 text-black"
            >
              <option value="">-- No parent --</option>
              {issues.map((iss: any) => (
                <option key={iss.id} value={iss.id}>
                  {iss.title}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:opacity-50"
              onClick={rem}
            >
              Cancel
            </button>
            <button
              className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              onClick={save}
            >
              Save
            </button>
          </div>
        </div>
      </ModalLayout>
    </>
  );
};
