import React from "react";
import { Toast } from "@/features/toast/types";
import { motion } from "framer-motion";
import { toastMotion } from "@/features/toast/ui/animation/ToastMotion";
import { ProgressBar } from "@/features/toast/ui/animation/ProgressBar";
import { useToastItemModel } from "@/features/toast/hooks";

export const Component = (props: { toast: Toast; onClose: () => void }) => {
  const { onClose, type, styles, message, duration, progress } =
    useToastItemModel(props);

  return (
    <motion.div
      {...toastMotion}
      layout
      className={`${styles[type]} relative overflow-hidden text-white p-4 rounded-lg shadow-lg flex items-center justify-between min-w-[300px]`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 font-bold text-xl leading-none">
        ×
      </button>

      {duration && <ProgressBar progress={progress} />}
    </motion.div>
  );
};
