import React from "react";
import { config } from "@/config";
import { Statuses } from "@/features/issue/types";

interface TreeViewProps {
  task: any;
  depth?: number;
  handleContextMenu: (e: React.MouseEvent, task: any) => void;
  openIssue: (task: any) => void;
  membersServer: any[];
  statusIcon: Record<Statuses, string>;
}

export const TreeView: React.FC<TreeViewProps> = ({
  task,
  depth = 0,
  handleContextMenu,
  openIssue,
  membersServer,
  statusIcon,
}) => {
  return (
    <div style={{ marginLeft: depth * 20 }} className="mb-3">
      <div
        onContextMenu={(e) => handleContextMenu(e, task)}
        onClick={() => openIssue(task)}
        className={`p-2 rounded cursor-pointer flex flex-col ${
          task.isOpen ? "bg-foreground" : "bg-background/60 hover:bg-background"
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="flex gap-1 items-center">
            <span className="font-semibold">
              {statusIcon[task.status?.name as Statuses] || "❓"} {task.title}
            </span>
            <span className="text-xs opacity-70">
              ({task.status?.name || "?"}, {task.priority})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 mt-1 ml-1">
          {task.assignees?.length ? (
            task.assignees.slice(0, 5).map((a: any, idx: number) => {
              const member = membersServer.find((m: any) => m.id === a.id);
              const avatar =
                member?.avatar_url &&
                (member.avatar_url.startsWith("http")
                  ? member.avatar_url
                  : `${config.cdnServiceUrl}/${member.avatar_url}`);
              const username = member?.username || "Unknown";

              return (
                <div
                  key={a.user_id}
                  className="relative group"
                  style={{ zIndex: 10 - idx }}
                >
                  <img
                    src={avatar || "/img/icon.png"}
                    alt={username}
                    title={username}
                    className="w-6 h-6 rounded-full border-2 border-foreground/70 object-cover"
                  />
                </div>
              );
            })
          ) : (
            <span className="text-xs opacity-50 italic">Unassigned</span>
          )}
        </div>
      </div>

      {task.subtasks?.length > 0 && (
        <div className="ml-4 border-l border-gray-600 pl-4">
          {task.subtasks.map((sub: any) => (
            <TreeView
              key={sub.id}
              task={sub}
              depth={depth + 1}
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
