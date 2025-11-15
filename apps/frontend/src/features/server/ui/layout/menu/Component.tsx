import React from "react";
import { createPortal } from "react-dom";
import { Plus, Link } from "lucide-react";
import { useContextMenu } from "@/shared/hooks";
import { AnimatedContextMenu } from "@/shared/ui";
import { Props } from "./interface";
import { useTranslation } from "react-i18next";

export const Component: React.FC<Props> = ({ x, y, onClose, onCreateChat }) => {
  const { menuRef } = useContextMenu<null, HTMLUListElement>();
  const { t } = useTranslation("server");

  const menuItems = [
    {
      label: t("menu.create"),
      icon: <Plus size={16} />,
      action: () => {
        onCreateChat();
        onClose();
      },
    },
    {
      label: t("menu.link"),
      icon: <Link size={16} />,
      action: () => {
        console.log("Create invite link");
        onClose();
      },
    },
  ];

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
