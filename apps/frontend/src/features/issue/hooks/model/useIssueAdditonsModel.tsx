import React from "react";
import { Orbit, Pencil, Trash2 } from "lucide-react";
import { Statuses } from "@/features/issue/types";
import { ContextMenuItem } from "@/shared/ui/AnimatedContextMenu/interface";

interface UseIssueAdditionsModelProps {
  contextMenu: any;
  openModal: (issue?: any) => void;
  setAssignModalHandler: (issue: any) => void;
  closeMenu: () => void;
  deleteIssue: (issue: any) => void;
}

/**
 * Хук для вспомогательных данных задачи:
 * - статусные иконки
 * - контекстное меню
 */
export function useIssueAdditionsModel({
  contextMenu,
  openModal,
  setAssignModalHandler,
  closeMenu,
  deleteIssue,
}: UseIssueAdditionsModelProps) {
  const statusIcon: Record<Statuses, string> = {
    Open: "⚪",
    "In Progress": "⏳",
    Review: "🔍",
    Done: "✅",
    Closed: "🚫",
  };

  const menuItems: ContextMenuItem[] = contextMenu
    ? [
        {
          label: "Edit issue",
          action: () => openModal(contextMenu?.data),
          icon: <Pencil size={14} />,
        },
        {
          label: "Assign to member",
          action: () => {
            setAssignModalHandler(contextMenu.data);
            closeMenu();
          },
          icon: <Orbit size={14} />,
        },
        {
          label: "Delete issue",
          action: () => {
            deleteIssue(contextMenu.data.id);
          },
          icon: <Trash2 size={14} />,
          danger: true,
        },
      ]
    : [];

  return { statusIcon, menuItems };
}
