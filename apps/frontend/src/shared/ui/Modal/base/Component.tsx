import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ModalLayoutProps } from "./interface";

export const Component: React.FC<ModalLayoutProps> = ({ children, open, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const container = document.getElementById("modal-root");

    const [internalOpen, setInternalOpen] = useState(true);
    const isControlled = open !== undefined;
    const visible = isControlled ? open : internalOpen;

    useEffect(() => {
        if (!visible) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                if (isControlled) onClose?.();
                else setInternalOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                if (isControlled) onClose?.();
                else setInternalOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [visible, isControlled, onClose]);

    if (!visible || !container) return null;

    return createPortal(
        <div className="fixed inset-0 z-[1023300] flex justify-center items-center bg-black/50 backdrop-blur-sm">
            <div
                ref={modalRef}
                className="bg-foreground/50 rounded-2xl shadow-xl backdrop-blur-xl"
            >
                {children}
            </div>
        </div>,
        container
    );
};
