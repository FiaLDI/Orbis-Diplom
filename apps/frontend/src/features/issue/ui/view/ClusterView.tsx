import React from "react";
import { Statuses } from "@/features/issue/types";
import { findIssueById } from "@/features/issue/utils"; // <-- твой helper

interface ClusterViewProps {
  issues: any[]; // ВСЕ корневые задачи проекта
  focusedIssueId: string | null;
  setFocusedIssueId: (id: string | null) => void;
  activePath: string[];
  handleContextMenu: (e: React.MouseEvent, task: any) => void;
  openIssue: (task: any) => void;
  statusIcon: Record<Statuses, string>;
}

export const ClusterView: React.FC<ClusterViewProps> = ({
  issues,
  focusedIssueId,
  setFocusedIssueId,
  activePath,
  handleContextMenu,
  openIssue,
  statusIcon,
}) => {
  const center =
    focusedIssueId
      ? findIssueById(issues, focusedIssueId)
      : issues[0]; // fallback на первый root

  if (!center) return null;

  const children = center.subtasks ?? [];

  const SIZE = 520;
  const CENTER = SIZE / 2;
  const RADIUS = 170;
  const angleStep = (2 * Math.PI) / Math.max(children.length, 1);

  return (
    <div className="relative mx-auto my-6" style={{ width: SIZE, height: SIZE }}>
      {/* CONNECTIONS */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {children.map((child: any, idx: number) => {
          const angle = idx * angleStep - Math.PI / 2;
          const x = CENTER + Math.cos(angle) * RADIUS;
          const y = CENTER + Math.sin(angle) * RADIUS;

          const isActive = activePath.includes(child.id);

          return (
            <line
              key={child.id}
              x1={CENTER}
              y1={CENTER}
              x2={x}
              y2={y}
              stroke={
                isActive
                  ? "rgba(59,130,246,0.9)"
                  : "rgba(148,163,184,0.5)"
              }
              strokeWidth={isActive ? 2.5 : 1.5}
            />
          );
        })}
      </svg>

      {/* CENTER NODE */}
      <div
        onClick={() => openIssue(center)}
        onContextMenu={(e) => handleContextMenu(e, center)}
        className="absolute z-10 px-5 py-3 rounded-full cursor-pointer
                   bg-primary text-primary-foreground shadow-lg
                   left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="flex items-center gap-2">
          <span>{statusIcon[center.status?.name as Statuses] || "❓"}</span>
          <span className="font-semibold max-w-[180px] truncate">
            {center.title}
          </span>
        </div>

        {/* BACK TO PARENT */}
        {center.parentId && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFocusedIssueId(center.parentId);
            }}
            className="absolute -top-7 left-1/2 -translate-x-1/2
                       text-xs opacity-70 hover:opacity-100"
          >
            ↑ Parent
          </button>
        )}
      </div>

      {/* CHILD NODES */}
      {children.map((child: any, idx: number) => {
        const angle = idx * angleStep - Math.PI / 2;
        const x = CENTER + Math.cos(angle) * RADIUS;
        const y = CENTER + Math.sin(angle) * RADIUS;

        const isActive = activePath.includes(child.id);

        return (
          <div
            key={child.id}
            style={{
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
            }}
            className="absolute"
          >
            <div
              onClick={() => setFocusedIssueId(child.id)}
              onContextMenu={(e) => handleContextMenu(e, child)}
              className={`
                px-4 py-2 rounded-full cursor-pointer shadow transition
                bg-background hover:ring-2 hover:ring-primary
                ${isActive ? "ring-2 ring-primary" : ""}
              `}
              title="Click to drill down"
            >
              <div className="flex items-center gap-2 text-sm">
                <span>
                  {statusIcon[child.status?.name as Statuses] || "❓"}
                </span>
                <span className="max-w-[140px] truncate">
                  {child.title}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
