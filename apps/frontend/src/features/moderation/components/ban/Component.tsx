import React, { useState } from "react";
import { ModalLayout } from "@/shared"; // путь подгони под свой
import { BanReasonModalProps } from "./interface";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

export const Component: React.FC<BanReasonModalProps> = ({
  open,
  onClose,
  onConfirm,
  username,
}) => {
  const { t } = useTranslation("moderation");
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(reason.trim() || undefined);
    setReason("");
  };

  return (
    <ModalLayout open={open} onClose={onClose}>
      <div className="flex flex-col text-white w-[400px]">
        <div 
            className="bg-background w-full rounded flex items-center justify-baseline p-5"
        >
            <div className="w-full">
              {t("audit.action.ban.title")} {username ? ` ${username}` : t("audit.logs.user")}?
            </div>
            <button 
                className="cursor-pointer p-0 w-fit" 
                onClick={() => onClose()}>
                    <X />
            </button>
        </div>
        <div className="p-5 flex flex-col gap-5">
          <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={t("audit.reason")}
          className="rounded-md bg-background w-full text-white p-2 resize-none min-h-[80px] outline-none placeholder:text-white/50"
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20"
            >
              {t("audit.form.cancel")}
            </button>
            <button
              onClick={handleConfirm}
              className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600"
            >
              {t("audit.form.submit")}
            </button>
        </div>
        </div>
        
      </div>
    </ModalLayout>
  );
};
