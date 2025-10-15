import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setOpenIssue, setOpenProject, useDeleteIssueMutation } from "../..";
import { Component as CreateIssue } from "./create";
import { Component as OpenIssue } from "./open";
import { MoveLeft, ListTree, Orbit } from "lucide-react";
import { Statuses } from "../../types";

interface Props {
  serverid?: number;
  name?: string;
  projectId?: number;
}

export const Component: React.FC<Props> = ({ serverid, name, projectId }) => {
  const issue = useAppSelector((s) => s.issue);
  const [deleteIssueApi] = useDeleteIssueMutation();
  const [editingIssue, setEditingIssue] = useState<any | null>(null);
  const dispatch = useAppDispatch();

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; issue: any | null; }>({ x: 0, y: 0, issue: null });
  const [viewMode, setViewMode] = useState<"tree" | "cluster">("tree");

  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleContextMenu = (e: React.MouseEvent, task: any) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, issue: task });
  };

  const closeMenu = () => setContextMenu({ x: 0, y: 0, issue: null });

  const editIssue = (task: any) => {
    setEditingIssue(task);
    closeMenu();
  };

  const deleteIssue = (task: any) => {
    deleteIssueApi({ projectId, issueId: task.id });
    closeMenu();
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

  const statusIcon: Record<Statuses, string> = {
    Open: "⚪",
    "In Progress": "⏳",
    Review: "🔍",
    Done: "✅",
    Closed: "🚫",
  };

  const openIssue = (task: any) => {
    dispatch(setOpenIssue(task.id));
    console.log(issue.issues)
    console.log("👆 Left click issue:", task);
  };

  /** ------- VIEW 1: Tree ------- */
  const renderTree = (task: any, depth = 0) => (
    <div key={task.id} style={{ marginLeft: depth * 20 }} className="mb-2">
      <div
        onContextMenu={(e) => handleContextMenu(e, task)}
        onClick={() => openIssue(task)}
        className={`p-2 rounded cursor-pointer flex justify-between items-center ${
          issue.openIssue === task.id ? "bg-blue-700" : "bg-gray-700 hover:bg-gray-600"
        }`}
      >
        <div>
          <span className="font-semibold">
            {statusIcon[task.status?.name as Statuses] || "❓"} {task.title}
          </span>
          <span className="ml-2 text-sm opacity-70">
            ({task.status?.name || "?"}, {task.priority})
          </span>
        </div>
      </div>
      {task.subtasks?.length > 0 && (
        <div className="ml-4 border-l border-gray-600 pl-4">
          {task.subtasks.map((sub: any) => renderTree(sub, depth + 1))}
        </div>
      )}
    </div>
  );

  /** ------- VIEW 2: Cluster ------- */
  /** ------- VIEW 2: Cluster ------- */
const renderCluster = (task: any, depth = 0) => {
  if (depth > 3) return null;
  const subs = task.subtasks || [];
  const radius = 120 + depth * 40; // чуть увеличил радиус, чтобы элементы не налегали
  const angleStep = (2 * Math.PI) / (subs.length || 1);

  return (
    <div className="relative flex items-center justify-center m-5">
      {/* SVG линии от центра к сабтаскам */}
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


      {/* Родитель */}
      <div
        onContextMenu={(e) => handleContextMenu(e, task)}
        onClick={() => openIssue(task)}
        className={`px-3 py-2 rounded-full cursor-pointer transition relative z-10 ${
          issue.openIssue === task.id
            ? "bg-blue-700"
            : "bg-blue-600 hover:bg-blue-500"
        }`}
      >
        {statusIcon[task.status?.name as Statuses] || "❓"} {task.title}
      </div>

      {/* Сабтаски */}
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
            {renderCluster(sub, depth + 1)}
          </div>
        );
      })}
    </div>
  );
};

  return (
    <div>
      {/* Шапка */}
      <div className="bg-[#2e3ed34f] p-5 flex w-full justify-between items-center">
        <h4 className="truncate text-lg text-white flex w-full gap-5 items-center">
          <button onClick={() => dispatch(setOpenProject(null))}>
            <MoveLeft />
          </button>
          <div>{name} Issues for {projectId}</div>
          <div className="flex gap-2">
            <button
              className={`px-2 py-1 rounded ${viewMode === "tree" ? "bg-blue-600" : "bg-gray-700"}`}
              onClick={() => setViewMode("tree")}
            >
              <ListTree className="w-4 h-4" />
            </button>
            <button
              className={`px-2 py-1 rounded ${viewMode === "cluster" ? "bg-blue-600" : "bg-gray-700"}`}
              onClick={() => setViewMode("cluster")}
            >
              <Orbit className="w-4 h-4" />
            </button>
            <CreateIssue
              projectId={projectId}
              serverId={serverid}
              statuses={issue.statuses}
              priorities={issue.priorities}
              onClose={() => setEditingIssue(null)}
            />
          </div>
        </h4>

        {editingIssue && (
          <CreateIssue
            projectId={projectId}
            serverId={serverid}
            statuses={issue.statuses}
            priorities={issue.priorities}
            initialData={editingIssue}
            onClose={() => setEditingIssue(null)}
          />
        )}
      </div>

      {/* Контент */}
      <div className="w-full h-full flex">
        <div className="h-full w-full p-5 text-white">
          {viewMode === "tree" &&
            issue.issues.filter((i: any) => !i.parent_id).map((root: any) => renderTree(root))}
          {viewMode === "cluster" &&
            issue.issues.filter((i: any) => !i.parent_id).map((root: any) => renderCluster(root))}
        </div>

        {(issue.openIssue !== null) && (
          <OpenIssue 
            projectId={projectId}
            serverId={serverid}
            issueId={issue.openIssue}
            issues={issue.issues}
            activeIssueChat={issue.issueChat}
          />
        )}

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
