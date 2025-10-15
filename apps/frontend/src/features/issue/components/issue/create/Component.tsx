import React, { useState, useEffect } from "react";
import { ModalLayout } from "@/components/layout/Modal/Modal";
import { Props } from "./interface";
import { selectAllIssues, selectIssueById, useCreateIssueMutation, useLazyGetIssuesQuery, useUpdateIssueMutation } from "@/features/issue";
import { Plus } from "lucide-react";
import { useAppSelector } from "@/app/hooks";

interface FormProps extends Props {
  initialData?: any | null;   // данные для редактирования
  onClose?: () => void;       // колбэк для закрытия
}


export const Component: React.FC<FormProps> = ({
  projectId,
  serverId,
  statuses,
  priorities,
  initialData = null,
  onClose,
}) => {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [statusId, setStatusId] = useState<number | null>(initialData?.status_id ?? null);
  const [priority, setPriority] = useState<string | null>(initialData?.priority ?? null);
  const [dueDate, setDueDate] = useState(
    initialData?.due_date ? new Date(initialData.due_date).toISOString().slice(0, 10) : ""
  );
  const [parentId, setParentId] = useState<number | null>(initialData?.parent_id ?? null);

  const [createIssue] = useCreateIssueMutation();
  const [updateIssue] = useUpdateIssueMutation();
  const [getIssue] = useLazyGetIssuesQuery();

  const issues = useAppSelector(selectAllIssues);

  // ⚡ Если создаём новую задачу — выставляем дефолтный статус (первый из списка)
  useEffect(() => {
    if (!initialData && statuses.length > 0 && statusId === null) {
      setStatusId(statuses[0].id);
    }
  }, [statuses, initialData, statusId]);

  const rem = () => {
    setOpen(false);
    if (!initialData) {
      setTitle("");
      setDescription("");
      setStatusId(null);
      setPriority(null);
      setDueDate("");
      setParentId(null);
    }
    if (onClose) onClose();

    getIssue(projectId)
  };

  const save = async () => {
  if (!title || statusId === null || !priority) return;

  try {
    if (initialData) {
      // update
      await updateIssue({
        projectId,                // 👈 теперь передаём projectId
        issueId: initialData.id,
        data: {
          title,
          description,
          statusId,
          priority,
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
          parent_id: parentId || null,
        },
      }).unwrap();
    } else {
      // create
      await createIssue({
        projectId,                // 👈 у тебя раньше было id, но лучше единообразно projectId
        data: {
          title,
          description,
          statusId,
          priority,
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
          parent_id: parentId || null,
        },
      }).unwrap();
    }

    rem();
  } catch (err) {
    console.error("Failed to save issue:", err);
  }
};

  return (
    <>
      {!initialData && (
        <button
          onClick={() => setOpen(true)}
          className="cursor-pointer rounded text-sm hover:text-black"
        >
          <Plus />
        </button>
      )}

      <ModalLayout open={open || !!initialData} onClose={() => setOpen(false)}>
        <div className="p-4 text-white space-y-4">
          <h4 className="text-lg font-semibold py-3 bg-[#4354ee8f] rounded text-center">
            {initialData ? "Edit Issue" : "Create Issue"}
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
              {issues
                .filter((iss: any) => iss.id !== initialData?.id) // нельзя выбрать сам себя
                .map((iss: any) => (
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
