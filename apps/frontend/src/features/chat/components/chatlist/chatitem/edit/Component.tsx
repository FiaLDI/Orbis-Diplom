import React, { useEffect, useState } from "react";
import { ModalLayout } from "@/shared";
import { useUpdateChatMutation } from "@/features/chat";
import { ChatEditFormProps } from "./interface";

export const Component: React.FC<ChatEditFormProps> = ({
  initialData,
  onClose,
  onSave
}) => {
  const [name, setName] = useState(initialData?.name ?? "");

  const [ updateChat ] = useUpdateChatMutation();

  useEffect(() => {
    if (initialData) {
      setName(initialData.name ?? "");
    }
  }, [initialData]);

  const save = async () => {
    if (!name.trim()) return;

    try {
      await updateChat({
        id: initialData.id,
        data: {
          name,
        },
      }).unwrap();
      onSave?.();
    } catch (err) {
      console.error("Failed to update chat:", err);
    } finally {
      onClose();
    }
  };

  return (
    <ModalLayout open={!!initialData} onClose={onClose}>
      <div className="p-4 text-white space-y-4">
        <h4 className="text-lg font-semibold py-3 bg-[#4354ee8f] rounded text-center">
          Edit Chat
        </h4>

        <div>
          <label className="block text-sm font-medium mb-1">Chat name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-2 py-1 text-black"
          />
        </div>

        <div className="flex gap-2">
          <button
            className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            onClick={save}
          >
            Save
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};
