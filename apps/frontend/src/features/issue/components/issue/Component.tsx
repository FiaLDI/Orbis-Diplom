import React, { useEffect, useRef, useState } from "react";
import { Props } from "./interface";
import { useAppSelector } from "@/app/hooks";
import { Component as CreateIssue } from "./create";
import { Statuses } from "../../types";
import { useDeleteIssueMutation } from "../..";

interface IssueClusterProps extends Props {
  scale?: number;
}

export const Component: React.FC<IssueClusterProps> = ({
  serverid,
  name,
  projectId,
  scale = 1,
}) => {
  const issue = useAppSelector((s) => s.issue);
  const [deleteIssueApi] = useDeleteIssueMutation();

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    issue: any | null;
  }>({ x: 0, y: 0, issue: null });

  const handleContextMenu = (e: React.MouseEvent, task: any) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      issue: task,
    });
  };

  const menuRef = useRef<HTMLDivElement | null>(null);

  const closeMenu = () => setContextMenu({ x: 0, y: 0, issue: null });

  const editIssue = (task: any) => {
    console.log("✏️ Edit issue", task);
    closeMenu();
    // тут открываешь модалку с редактированием
  };

  const deleteIssue = (task: any) => {
    console.log("🗑️ Delete issue", task);
    deleteIssueApi({issueId: task.id})
    closeMenu();
    // тут вызываешь deleteIssueMutation
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };

    if (contextMenu.issue) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu.issue]);

  if (!serverid || !name || !projectId) return null;

  const priorityStyle: Record<string, { size: number; color: string }> = {
    LOW: { size: 60 * scale, color: "#22c55e" },
    MEDIUM: { size: 80 * scale, color: "#3b82f6" },
    HIGH: { size: 100 * scale, color: "#f59e0b" },
    CRITICAL: { size: 120 * scale, color: "#ef4444" },
  };

  const statusIcon: Record<Statuses, string> = {
    Open: "⚪",
    "In Progress": "⏳",
    Review: "🔍",
    Done: "✅",
    Closed: "🚫",
  };

  const renderIssue = (val: any) => {
    const style = priorityStyle[val.priority] || priorityStyle.MEDIUM;
    const icon = statusIcon[val.status?.name as Statuses] || "❓";

    return (
      <div
        onContextMenu={(e) => handleContextMenu(e, val)}
        className="flex flex-col items-center justify-center rounded-full font-semibold shadow-md transition hover:scale-105 cursor-pointer"
        style={{
          width: style.size,
          height: style.size,
          backgroundColor: style.color,
        }}
      >
        <span className="text-lg">{icon}</span>
        <span className="text-xs text-center px-2 truncate">{val.title}</span>
      </div>
    );
  };

  const renderCluster = (root: any, depth = 0) => {
    if (depth > 3) return null;
    const subs = root.subtasks || [];
    const radius = (60 + depth * 40) * scale;
    const angleStep = (2 * Math.PI) / (subs.length || 1);

    return (
      <div
        className="relative flex items-center justify-center"
        style={{ width: 300 * scale, height: 300 * scale }}
      >
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={[-150 * scale, -150 * scale, 300 * scale, 300 * scale].join(" ")}
        >
          {subs.map((_: any, idx: number) => {
            const angle = idx * angleStep;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            return <line key={idx} x1={0} y1={0} x2={x} y2={y} stroke="#aaa" />;
          })}
        </svg>

        <div className="absolute">{renderIssue(root)}</div>

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
              {renderIssue(sub)}
              {renderCluster(sub, depth + 1)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <div className="bg-[#2e3ed34f] p-5 flex w-full justify-between items-center">
        <h4 className="truncate text-lg text-white">
          {name} Issues for {projectId}
        </h4>
        <CreateIssue
          projectId={projectId}
          serverId={serverid}
          statuses={issue.statuses}
          priorities={issue.priorities}
        />
      </div>

      <div className="h-full w-full flex flex-wrap gap-6 text-white p-5">
        {issue.issues.filter((i: any) => !i.parent_id).map((root: any) => renderCluster(root))}
      </div>

      {/* Контекстное меню */}
      {contextMenu.issue && (
        <div
            ref={menuRef}
          className="fixed z-50 bg-[#1e293b] text-white rounded shadow-lg py-2"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={closeMenu}
        >
          <button
            onClick={() => editIssue(contextMenu.issue)}
            className="block w-full text-left px-4 py-2 hover:bg-blue-600"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => deleteIssue(contextMenu.issue)}
            className="block w-full text-left px-4 py-2 hover:bg-red-600"
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
};
