import React from "react";
import { config } from "@/config";
import { Statuses } from "../../types";

interface ClusterViewProps {
  task: any;
  depth?: number;
  handleContextMenu: (e: React.MouseEvent, task: any) => void;
  openIssue: (task: any) => void;
  membersServer: any[];
  statusIcon: Record<Statuses, string>;
}

export const ClusterView: React.FC<ClusterViewProps> = ({
  task,
  depth = 0,
  handleContextMenu,
  openIssue,
  membersServer,
  statusIcon,
}) => {
  if (depth > 3) return null;

  const subs = task.subtasks || [];
  const radius = 120 + depth * 40;
  const angleStep = (2 * Math.PI) / (subs.length || 1);

  return (
    <div className="relative flex items-center justify-center m-5">
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {subs.map((sub: any, idx: number) => {
          const angle = idx * angleStep;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <line
              key={sub.id}
              x1="0"
              y1="0"
              x2={x}
              y2={y}
              stroke="#aaa"
              strokeWidth={1.5}
            />
          );
        })}
      </svg>

      <div
        onContextMenu={(e) => handleContextMenu(e, task)}
        onClick={() => openIssue(task)}
        className="px-3 py-2 rounded-full cursor-pointer transition relative z-10 flex flex-col items-center"
      >
        <span>
          {statusIcon[task.status?.name as Statuses] || "❓"} {task.title}
        </span>
        <div className="flex gap-1 mt-1">
          {task.assignees?.length ? (
            task.assignees.slice(0, 3).map((a: any) => {
              const member = membersServer.find((m: any) => m.id === a.id);
              const avatar =
                member?.avatar_url &&
                (member.avatar_url.startsWith("http")
                  ? member.avatar_url
                  : `${config.cdnServiceUrl}/${member.avatar_url}`);
              const username = member?.username || "Unknown";

              return (
                <img
                  key={a.user_id}
                  src={avatar || "/img/icon.png"}
                  alt={username}
                  title={username}
                  className="w-5 h-5 rounded-full border-2 border-[#1e293b] object-cover"
                />
              );
            })
          ) : (
            <span className="text-[10px] opacity-50 italic">Unassigned</span>
          )}
        </div>
      </div>

      {subs.map((sub: any, idx: number) => {
        const angle = idx * angleStep;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return (
          <div
            key={sub.id}
            className="absolute"
            style={{ transform: `translate(${x}px, ${y}px)` }}
          >
            <ClusterView
              task={sub}
              depth={depth + 1}
              handleContextMenu={handleContextMenu}
              openIssue={openIssue}
              membersServer={membersServer}
              statusIcon={statusIcon}
            />
          </div>
        );
      })}
    </div>
  );
};
