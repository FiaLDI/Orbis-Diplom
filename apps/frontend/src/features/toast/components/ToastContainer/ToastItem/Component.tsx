import React, { useEffect, useState } from "react";
import { Toast } from "@/features/toast/types";
import { motion, easeOut, easeIn } from "framer-motion";

export const Component = ({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: () => void;
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if(!toast) return;
    if (!toast.duration) return;

    const start = Date.now();
    const timer = setInterval(() => {
      if (!toast.duration) return;
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - (elapsed / toast.duration) * 100);
      setProgress(pct);
      if (pct === 0) onClose();
    }, 100);

    return () => clearInterval(timer);
  }, [toast.duration, onClose]);

  const styles = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500 text-black",
    info: "bg-blue-500",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.25, ease: easeOut } }}
      exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2, ease: easeIn } }}
      className={`${styles[toast.type]} relative overflow-hidden text-white p-4 rounded-lg shadow-lg flex items-center justify-between min-w-[300px]`}
    >
      <span>{toast.message}</span>
      <button onClick={onClose} className="ml-4 font-bold text-xl leading-none">
        ×
      </button>

      {/* 🔵 Progress-bar */}
      {toast.duration && (
        <motion.div
          className="absolute bottom-0 left-0 h-[3px] bg-white/70"
          initial={{ width: "100%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      )}
    </motion.div>
  );
};
