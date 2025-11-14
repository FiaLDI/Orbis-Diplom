import React, { useState } from "react";
import { Component as ModalLayout } from "../base";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title = "Подтверждение",
  message = "Вы уверены?",
  onConfirm,
  onCancel,
  confirmLabel = "Да",
  cancelLabel = "Отмена",
}) => {
  if (!open) return null;

  return (
    <ModalLayout open={open} onClose={onCancel}>
      <div className="w-[300px] p-6 text-white flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-center">{title}</h2>
        <p className="text-center text-sm text-white/70">{message}</p>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md transition"
          >
            {cancelLabel}
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md transition"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};
