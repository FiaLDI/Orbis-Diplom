import React, { useState } from "react";
import { ModalLayout } from "@/components/layout/Modal/Modal"; // путь подгони под свой

interface BanReasonModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  username?: string;
}

export const Component: React.FC<BanReasonModalProps> = ({
  open,
  onClose,
  onConfirm,
  username,
}) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(reason.trim() || undefined);
    setReason("");
  };

  return (
    <ModalLayout open={open} onClose={onClose}>
      <div className="flex flex-col gap-4 text-white min-w-[320px] max-w-[400px]">
        <h2 className="text-xl font-semibold">
          Забанить {username ? `пользователя ${username}` : "участника"}?
        </h2>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Причина (необязательно)"
          className="rounded-lg bg-[#1e2a8a] text-white p-2 resize-none min-h-[80px] outline-none placeholder:text-white/50"
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20"
          >
            Отмена
          </button>
          <button
            onClick={handleConfirm}
            className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600"
          >
            Забанить
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};
