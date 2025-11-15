import { useState } from "react";
import { useTranslation } from "react-i18next";

export const useBanReasonModel = (onConfirm: any) => {
  const { t } = useTranslation("moderation");
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(reason.trim() || undefined);
    setReason("");
  };

  return {
    t,
    reason,
    setReason,
    handleConfirm,
  };
};
