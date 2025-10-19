import React, { useEffect, useRef, useState } from "react";
import { ModalLayoutProps } from "./interface";

export const Component: React.FC<ModalLayoutProps> = ({
  children,
  open,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // локальный стейт (используется если open не проброшен)
  const [internalOpen, setInternalOpen] = useState(true);
  const isControlled = open !== undefined;
  const visible = isControlled ? open : internalOpen;

  // Закрытие по клику вне модалки или по Esc
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

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex justify-center items-center bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-[#3247be] rounded-2xl p-6 shadow-xl"
      >
        {children}
      </div>
    </div>
  );
};
