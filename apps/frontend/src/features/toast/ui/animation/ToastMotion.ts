import { easeIn, easeOut } from "framer-motion";
import { ToastPosition } from "../../types";

export const toastMotion = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.25, ease: easeOut },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.2, ease: easeIn },
  },
};

export const TOAST_POSITIONS: Record<ToastPosition, string> = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
};

