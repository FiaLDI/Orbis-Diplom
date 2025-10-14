import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Props } from "./interface";

export const Component: React.FC<Props> = ({ x, y, onClose, onCreateChat }) => {
  const ref = useRef<HTMLUListElement | null>(null);
  const container = document.body;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const menu = (
    <ul
      ref={ref}
      className="fixed bg-[#2550dd] rounded-[10px] shadow-lg z-[9999] animate-fade-in"
      style={{ top: y, left: x }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <li
        className="whitespace-nowrap p-2 text-white hover:bg-blue-600 cursor-pointer"
        onClick={() => {
          onCreateChat();
          onClose();
        }}
      >
        Create text chat
      </li>
      <li
        className="whitespace-nowrap p-2 text-white hover:bg-blue-600 cursor-pointer"
        onClick={() => {
          console.log("Create invite link");
          onClose();
        }}
      >
        Create invite link
      </li>
    </ul>
  );

  return createPortal(menu, container);
};
