import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface ContextMenuItem {
    label: string;
    action: () => void;
    icon?: React.ReactNode;
    danger?: boolean;
    disabled?: boolean;
}

export interface AnimatedContextMenuProps {
    visible: boolean;
    x: number;
    y: number;
    items: ContextMenuItem[];
    menuRef: React.RefObject<HTMLElement>;
    onClose: () => void;
}

/**
 * Универсальное анимированное контекстное меню (в стиле Discord)
 * ✅ Автоматическое позиционирование внутри экрана
 * ✅ Плавная анимация появления/скрытия
 * ✅ Поддержка danger, disabled, и иконок
 */
export const AnimatedContextMenu: React.FC<AnimatedContextMenuProps> = ({
    visible,
    x,
    y,
    items,
    onClose,
    menuRef,
}) => {
    const menuWidth = 200;
    const itemHeight = 36;
    const padding = 10;

    // ✅ Расчёт безопасной позиции меню
    const { safeX, safeY, origin } = useMemo(() => {
        const totalHeight = items.length * itemHeight + padding * 2;
        const fitsRight = x + menuWidth < window.innerWidth;
        const fitsBottom = y + totalHeight < window.innerHeight;

        const calcX = fitsRight ? x : x - menuWidth;
        const calcY = fitsBottom ? y : y - totalHeight;

        // Определяем точку анимации (scale origin)
        const transformOrigin = `${fitsBottom ? "top" : "bottom"} ${fitsRight ? "left" : "right"}`;

        return { safeX: calcX, safeY: calcY, origin: transformOrigin };
    }, [x, y, items.length]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.ul
                    ref={menuRef as React.RefObject<HTMLUListElement>}
                    key="animated-menu"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="fixed z-[10000] min-w-[180px] overflow-hidden rounded-xl border border-white/10
                     bg-[#1e293bcc] backdrop-blur-md text-white shadow-2xl"
                    style={{
                        top: `${safeY}px`,
                        left: `${safeX}px`,
                        transformOrigin: origin, // ✅ направление анимации в зависимости от позиции
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    {items.map((item, i) => (
                        <li
                            key={i}
                            onClick={() => {
                                if (!item.disabled) {
                                    item.action();
                                    onClose();
                                }
                            }}
                            className={`flex items-center gap-2 px-4 py-2 cursor-pointer transition-all select-none
                ${item.disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-white/10 active:scale-[0.98]"}
                ${item.danger ? "text-red-400 hover:text-red-300 hover:bg-red-500/10" : ""}
              `}
                            style={{ minHeight: `${itemHeight}px` }}
                        >
                            {item.icon && <span className="text-base">{item.icon}</span>}
                            <span>{item.label}</span>
                        </li>
                    ))}
                </motion.ul>
            )}
        </AnimatePresence>
    );
};
