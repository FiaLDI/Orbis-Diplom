import { useEffect, useState } from "react";
import { Toast } from "@/features/toast/types";

export function useToastItemModel({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: () => void;
}) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!toast) return;
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
    success: "bg-green-500/50",
    error: "bg-red-500/50",
    warning: "bg-yellow-500/50 text-black",
    info: "bg-blue-500/50",
  };

  return {
    progress,
    onClose,
    styles,
    duration: toast.duration,
    message: toast.message,
    type: toast.type,
  };
}
