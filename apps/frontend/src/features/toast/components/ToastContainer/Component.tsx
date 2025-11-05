import React from "react";
import { selectToasts, removeToast, selectToastPosition } from "@/features/toast/slice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Component as ToastItem } from "./ToastItem";
import { AnimatePresence, motion } from "framer-motion";

export const Component = () => {
    const toasts = useAppSelector(selectToasts);
    const position = useAppSelector(selectToastPosition);
    const dispatch = useAppDispatch();

    const positions: Record<string, string> = {
        "top-right": "top-4 right-4 items-end",
        "top-left": "top-4 left-4 items-start",
        "bottom-right": "bottom-4 right-4 items-end",
        "bottom-left": "bottom-4 left-4 items-start",
        "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
        "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
    };

    return (
        <motion.div
            layout
            className={`fixed z-50 flex flex-col space-y-2 pointer-events-none ${positions[position]}`}
        >
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <motion.div key={toast.id} layout className="pointer-events-auto">
                        <ToastItem toast={toast} onClose={() => dispatch(removeToast(toast.id))} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );
};
