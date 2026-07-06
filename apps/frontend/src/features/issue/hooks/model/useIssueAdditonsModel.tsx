import React, { useState } from "react";
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
    const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

    const statusIcon: Record<Statuses, string> = {
        Open: "⚪",
        "In Progress": "⏳",
        Review: "🔍",
        Done: "✅",
        Closed: "🚫",
    };

    const isCollapsed = (id: string) => collapsed.has(id);

    const toggleCollapse = (id: string) => {
        setCollapsed((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
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

    return { collapsed, setCollapsed, isCollapsed, toggleCollapse, statusIcon, menuItems };
}
