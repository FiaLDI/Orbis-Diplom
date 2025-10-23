// ContextMenu.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ContextMenuProps {
    visible: boolean;
    x: number;
    y: number;
    onClose: () => void;
    items: { label: string; action: () => void; danger?: boolean }[];
    menuRef: React.RefObject<HTMLUListElement>; // строго UL
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
    visible,
    x,
    y,
    items,
    onClose,
    menuRef,
}) => {
    return (
        <AnimatePresence>
            {visible && (
                <motion.ul
                    ref={menuRef} // <-- тип теперь совпадает
                    initial={{ opacity: 0, scale: 0.9, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.12 }}
                    className="fixed bg-[#1a1a2b] text-white text-sm rounded-xl shadow-lg py-2 min-w-[160px] border border-white/10"
                    style={{ top: `${y}px`, left: `${x}px`, zIndex: 9999 }}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    {items.map((item, i) => (
                        <li
                            key={i}
                            onClick={() => {
                                item.action();
                                onClose();
                            }}
                            className={`px-4 py-2 hover:bg-white/10 cursor-pointer ${
                                item.danger ? "text-red-400 hover:text-red-300" : ""
                            }`}
                        >
                            {item.label}
                        </li>
                    ))}
                </motion.ul>
            )}
        </AnimatePresence>
    );
};
