import React from "react";
import { ModalLayout } from "@/shared";
import { BanReasonModalProps } from "./interface";
import { useBanReasonModel } from "../../model/useBanReasonModel";
import { BanReasonLayout } from "../../ui/layout/BanReasonLayout";
import { BanReasonHead } from "../../ui/layout/BanReasonHead";
import { BanReasonAction } from "../../ui/button/BanReasonAction";

export const Component: React.FC<BanReasonModalProps> = ({
  open,
  onClose,
  onConfirm,
  username,
}) => {
  const { t, reason, setReason, handleConfirm } = useBanReasonModel(onConfirm);
  return (
    <ModalLayout open={open} onClose={onClose}>
      <BanReasonLayout
        head={
          <BanReasonHead
            title={`${t("audit.action.ban.title")} ${username ? ` ${username}` : t("audit.logs.user")}?`}
            onClose={() => onClose()}
          />
        }
        textarea={
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t("audit.reason")}
            className="rounded-md bg-background w-full text-white p-2 resize-none min-h-[80px] outline-none placeholder:text-white/50"
          />
        }
        controll={
          <>
            <BanReasonAction handler={onClose} title={t("audit.form.cancel")} />
            <BanReasonAction
              handler={handleConfirm}
              title={t("audit.form.submit")}
            />
          </>
        }
      />
    </ModalLayout>
  );
};
