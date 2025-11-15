import { motion } from "framer-motion";
import React from "react";
import { TOAST_POSITIONS } from "../animation/ToastMotion";
import { ToastPosition } from "../../types";

export const ToastLayout: React.FC<{
    children: React.ReactNode;
    position: ToastPosition;
}> = ({ children, position }) => {
    const positionClass = TOAST_POSITIONS[position];

    return (
        <motion.div
            layout
            className={`fixed z-50 flex flex-col space-y-2 pointer-events-none ${positionClass}`}
        >
            {children}
        </motion.div>
    );
};
