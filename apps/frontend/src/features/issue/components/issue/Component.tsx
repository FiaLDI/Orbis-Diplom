import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setOpenIssue, setOpenProject, useDeleteIssueMutation } from "../..";
import { Component as CreateIssue } from "./create";
import { Component as OpenIssue } from "./open";
import { Component as AssignModal } from "./assign";
import { MoveLeft, ListTree, Orbit, Pencil, Trash2 } from "lucide-react";
import { Statuses } from "../../types";
import { AnimatedContextMenu } from "@/shared/ui";
import { useContextMenu } from "@/shared/hooks";
import { config } from "@/config";
import { ContextMenuItem } from "@/shared/ui/AnimatedContextMenu/interface";

interface Props {
    serverId?: number;
    name?: string;
    projectId?: number;
}

export const Component: React.FC<Props> = ({ serverId, name, projectId }) => {
    const issue = useAppSelector((s) => s.issue);
    const [deleteIssueApi] = useDeleteIssueMutation();
    const [editingIssue, setEditingIssue] = useState<any | null>(null);
    const [viewMode, setViewMode] = useState<"tree" | "cluster">("tree");
    const [assignModal, setAssignModal] = useState<{ open: boolean; issue: any | null }>({
        open: false,
        issue: null,
    });
    const membersServer = useAppSelector((s) => s.server.activeserver?.users ?? []);

    const dispatch = useAppDispatch();

    const { contextMenu, handleContextMenu, closeMenu, menuRef } = useContextMenu<any>();

    if (!serverId || !name || !projectId) return null;

    const statusIcon: Record<Statuses, string> = {
        Open: "⚪",
        "In Progress": "⏳",
        Review: "🔍",
        Done: "✅",
        Closed: "🚫",
    };

    const openIssue = (task: any) => {
        dispatch(setOpenIssue(task.id));
    };

    const editIssue = (task: any) => {
        setEditingIssue(task);
        closeMenu();
    };

    const deleteIssue = (task: any) => {
        deleteIssueApi({ projectId, issueId: task.id });
        closeMenu();
    };

    const renderTree = (task: any, depth = 0) => (
        <div key={task.id} style={{ marginLeft: depth * 20 }} className="mb-3">
            <div
                onContextMenu={(e) => handleContextMenu(e, task)}
                onClick={() => openIssue(task)}
                className={`p-2 rounded cursor-pointer flex flex-col ${
                    issue.openIssue === task.id
                        ? "bg-foreground"
                        : "bg-background/60 hover:background"
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
                    {task.assignees && task.assignees.length > 0 ? (
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
                    {task.subtasks.map((sub: any) => renderTree(sub, depth + 1))}
                </div>
            )}
        </div>
    );

    /** ------- VIEW 2: Cluster ------- */
    const renderCluster = (task: any, depth = 0) => {
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
                    className={`px-3 py-2 rounded-full cursor-pointer transition relative z-10 flex flex-col items-center`}
                >
                    <span>
                        {statusIcon[task.status?.name as Statuses] || "❓"} {task.title}
                    </span>
                    <div className="flex gap-1 mt-1">
                        {task.assignees && task.assignees.length > 0 ? (
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
                            {renderCluster(sub, depth + 1)}
                        </div>
                    );
                })}
            </div>
        );
    };

    const menuItems: ContextMenuItem[] = contextMenu
        ? [
              {
                  label: "Edit issue",
                  action: () => editIssue(contextMenu.data),
                  icon: <Pencil size={14} />,
              },
              {
                  label: "Assign to member",
                  action: () => {
                      setAssignModal({ open: true, issue: contextMenu.data });
                      closeMenu();
                  },
                  icon: <Orbit size={14} />,
              },
              {
                  label: "Delete issue",
                  action: () => deleteIssue(contextMenu.data),
                  icon: <Trash2 size={14} />,
                  danger: true,
              },
          ]
        : [];

    return (
        <div className="h-full w-full overflow-y-auto scroll-hidden">
            <div className="bg-background/90 p-5 flex w-full justify-between items-center">
                <h4 className="truncate text-lg text-white flex w-full gap-5 items-center">
                    <button onClick={() => dispatch(setOpenProject(null))}>
                        <MoveLeft />
                    </button>
                    <div>
                        {name} Issues for {projectId}
                    </div>
                    <div className="flex gap-2">
                        <button
                            className={`px-2 py-1 rounded ${
                                viewMode === "tree" ? "bg-foreground" : "bg-foreground/50"
                            }`}
                            onClick={() => setViewMode("tree")}
                        >
                            <ListTree className="w-4 h-4" />
                        </button>
                        <button
                            className={`px-2 py-1 rounded ${
                                viewMode === "cluster" ? "bg-foreground" : "bg-foreground/50"
                            }`}
                            onClick={() => setViewMode("cluster")}
                        >
                            <Orbit className="w-4 h-4" />
                        </button>
                        <CreateIssue
                            projectId={projectId}
                            serverId={serverId}
                            statuses={issue.statuses}
                            priorities={issue.priorities}
                            onClose={() => setEditingIssue(null)}
                        />
                    </div>
                </h4>

                {editingIssue && (
                    <CreateIssue
                        projectId={projectId}
                        serverId={serverId}
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
                        issue.issues
                            .filter((i: any) => !i.parent_id)
                            .map((root: any) => renderTree(root))}
                    {viewMode === "cluster" &&
                        issue.issues
                            .filter((i: any) => !i.parent_id)
                            .map((root: any) => renderCluster(root))}
                </div>

                {issue.openIssue !== null && (
                    <OpenIssue
                        projectId={projectId}
                        serverId={serverId}
                        issueId={issue.openIssue}
                        issues={issue.issues}
                        activeIssueChat={issue.issueChat}
                    />
                )}
            </div>

            <AnimatedContextMenu
                visible={!!contextMenu}
                x={contextMenu?.x || 0}
                y={contextMenu?.y || 0}
                items={menuItems}
                menuRef={menuRef}
                onClose={closeMenu}
            />

            {assignModal.open && (
                <AssignModal
                    issue={assignModal.issue}
                    onClose={() => setAssignModal({ open: false, issue: null })}
                    projectId={projectId}
                    serverId={serverId}
                />
            )}
        </div>
    );
};
