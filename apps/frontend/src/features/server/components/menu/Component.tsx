import React from "react";
import { createPortal } from "react-dom";
import { Plus, Link } from "lucide-react";
import { useContextMenu } from "@/features/shared";
import { AnimatedContextMenu } from "@/features/shared/components/AnimatedContextMenu";
import { Props } from "./interface";

/**
 * Контекстное меню для создания чатов и ссылок приглашений
 * Использует общую систему AnimatedContextMenu
 */
export const Component: React.FC<Props> = ({ x, y, onClose, onCreateChat }) => {
  // Используем наш хук контекстного меню, чтобы получить ref, ESC и обработчики
  const { menuRef } = useContextMenu<null, HTMLUListElement>();

  // Пункты меню
  const menuItems = [
    {
      label: "Create text chat",
      icon: <Plus size={16} />,
      action: () => {
        onCreateChat();
        onClose();
      },
    },
    {
      label: "Create invite link",
      icon: <Link size={16} />,
      action: () => {
        console.log("Create invite link");
        onClose();
      },
    },
  ];

  // AnimatedContextMenu сам обрабатывает анимацию и позиционирование
  const menu = (
    <AnimatedContextMenu
      visible={true}
      x={x}
      y={y}
      items={menuItems}
      menuRef={menuRef}
      onClose={onClose}
    />
  );

  return createPortal(menu, document.body);
};
