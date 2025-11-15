import React from "react";
import { Component as ToastItem } from "./ToastItem";
import { AnimatePresence, motion } from "framer-motion";
import { useToastModel } from "@/features/toast/hooks";
import { ToastLayout } from "@/features/toast/ui/layout/ToastLayout";

export const ToastContainer = () => {
  const { toasts, position, removeToastHandler } = useToastModel();

  return (
    <ToastLayout position={position}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div key={toast.id} layout className="pointer-events-auto">
            <ToastItem
              toast={toast}
              onClose={() => removeToastHandler(toast.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </ToastLayout>
  );
};
