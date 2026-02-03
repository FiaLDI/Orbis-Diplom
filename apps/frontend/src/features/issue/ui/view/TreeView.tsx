import React, { useState } from "react";
import { Statuses } from "@/features/issue/types";

interface TreeViewProps {
  task: any;
  depth?: number;
  collapsed: Set<string>;
  onMove: (dragId: string, targetId: string | null) => void;
  toggleCollapse: (id: string) => void;
  handleContextMenu: (e: React.MouseEvent, task: any) => void;
  openIssue: (task: any) => void;
  membersServer: any[];
  statusIcon: Record<Statuses, string>;
}

export const TreeView: React.FC<TreeViewProps> = ({
  task,
  depth = 0,
  collapsed,
  toggleCollapse,
  onMove,
  handleContextMenu,
  openIssue,
  membersServer,
  statusIcon,
}) => {
  const hasSubs = task.subtasks?.length > 0;
  const isCollapsed = collapsed.has(task.id);

  const [dragOver, setDragOver] = useState(false);

  return (
    <div style={{ marginLeft: depth * 24 }} className="mb-2">
      <div
        draggable
        onDragStart={(e) => {
          e.stopPropagation();
          e.dataTransfer.setData("issueId", task.id);
          e.dataTransfer.effectAllowed = "move";
        }}
        onDragOver={(e) => {
          e.preventDefault(); // ОБЯЗАТЕЛЬНО
          e.stopPropagation();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOver(false);

          const draggedId = e.dataTransfer.getData("issueId");
          if (!draggedId || draggedId === task.id) return;

          onMove(draggedId, task.id);
        }}
        onClick={() => openIssue(task)}
        onContextMenu={(e) => handleContextMenu(e, task)}
        className={`
          group flex items-center justify-between gap-2 px-3 py-2 rounded-md cursor-pointer
          transition
          ${dragOver ? "bg-primary/10 ring-1 ring-primary" : "bg-background/60 hover:bg-background"}
        `}
      >
        {/* LEFT */}
        <div className="flex items-center gap-2 min-w-0">
          {hasSubs && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleCollapse(task.id);
              }}
              className="text-xs opacity-60 hover:opacity-100"
              title={isCollapsed ? "Expand" : "Collapse"}
            >
              {isCollapsed ? "▸" : "▾"}
            </button>
          )}

          <span className="text-sm">
            {statusIcon[task.status?.name as Statuses] || "❓"}
          </span>

          <span className="font-medium truncate">
            {task.title}
          </span>
        </div>

        {/* RIGHT – hover actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleContextMenu(e, task);
            }}
            className="text-xs opacity-70 hover:opacity-100"
            title="More actions"
          >
            ⋮
          </button>
        </div>
      </div>

      {/* CHILDREN */}
      {hasSubs && !isCollapsed && (
        <div className="mt-2 pl-4 border-l border-border/40">
          {task.subtasks.map((sub: any) => (
            <TreeView
              key={sub.id}
              task={sub}
              depth={depth + 1}
              collapsed={collapsed}
              toggleCollapse={toggleCollapse}
              onMove={onMove}
              handleContextMenu={handleContextMenu}
              openIssue={openIssue}
              membersServer={membersServer}
              statusIcon={statusIcon}
            />
          ))}
        </div>
      )}
    </div>
  );
};
