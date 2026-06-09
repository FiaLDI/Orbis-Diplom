import React, { useState } from "react";
import { IssueFormModal } from "../create";
import { Component as OpenIssue } from "../open";
import { Component as AssignModal } from "../assign";
import { AnimatedContextMenu } from "@/shared/ui";
import { useContextMenu } from "@/shared/hooks";
import { useIssueQuery } from "@/features/issue/hooks";
import { useIssueModel } from "@/features/issue/hooks";
import { useIssueEditModal } from "@/features/issue/hooks";
import { IssueListLayout } from "@/features/issue/ui/layout/IssueListLayout";
import { BackButton } from "@/features/issue/ui/button/BackButton";
import { IssueListHead } from "@/features/issue/ui/layout/IssueListHead";
import { ChangeViewLayout } from "@/features/issue/ui/layout/ChangeViewLayout";
import { CreateButton } from "@/features/issue/ui/button/CreateButton";
import { ClusterView } from "@/features/issue/ui/view/ClusterView";
import { TreeView } from "@/features/issue/ui/view/TreeView";
import { useIssueAdditionsModel } from "@/features/issue/hooks";
import { useIssueAssignModal } from "@/features/issue/hooks";
import { findIssueById, getContextIssues } from "@/features/issue/utils";
import { ClusterContextPanel } from "../../view/ClusterContextPanel";

/* =======================
   HELPERS
======================= */

function getIssuePath(issues: any[], id: string): string[] {
  for (const issue of issues) {
    const path = findPath(issue, id);
    if (path) return path;
  }
  return [];
}

function findPath(node: any, targetId: string): string[] | null {
  if (node.id === targetId) return [node.id];

  for (const sub of node.subtasks ?? []) {
    const subPath = findPath(sub, targetId);
    if (subPath) return [node.id, ...subPath];
  }
  return null;
}

/* =======================
   COMPONENT
======================= */

interface Props {
  serverId?: string;
  name?: string;
  projectId?: string;
}

export const Component: React.FC<Props> = ({ serverId, name, projectId }) => {
  const { open, editingIssue, openModal } = useIssueEditModal();
  const [viewMode, setViewMode] = useState<"tree" | "cluster">("tree");
  const [focusedIssueId, setFocusedIssueId] = useState<string | null>(null);

  const { assignModal, closeModalAssign, setAssignModalHandler } =
    useIssueAssignModal();

  const { contextMenu, handleContextMenu, closeMenu, menuRef } =
    useContextMenu<any>();

  const {
    updateState,
    createState,
    deleteIssue,
    onMoveIssue,
    updateIssue,
    createIssue,
    emitServerUpdate,
  } = useIssueQuery(serverId, projectId, closeMenu);

  const { issue, activeIssueChat, membersServer, openIssue, back } =
    useIssueModel();

  const {
    statusIcon,
    menuItems,
    collapsed,
    toggleCollapse,
  } = useIssueAdditionsModel({
    contextMenu,
    openModal,
    setAssignModalHandler,
    closeMenu,
    deleteIssue,
  });

  if (!serverId || !name || !projectId) return null;

  const roots = issue.issues.filter((i: any) => !i.parentId);

  const activePath =
    focusedIssueId ? getIssuePath(issue.issues, focusedIssueId) : [];
  
    const context =
  focusedIssueId
    ? getContextIssues(issue.issues, focusedIssueId)
    : null;


  return (
    <IssueListLayout
      back={<BackButton handler={back} />}
      head={<IssueListHead name={name} projectId={projectId} />}
      viewChange={
        <ChangeViewLayout setViewMode={setViewMode} viewMode={viewMode} />
      }
      createIssue={<CreateButton handler={() => openModal()} />}

      /* =======================
         ISSUE FORM
      ======================= */
      IssueFormModal={
        <>
          {open && (
            <IssueFormModal
              key={editingIssue?.id ?? "new"}
              projectId={projectId}
              serverId={serverId}
              statuses={issue.statuses}
              priorities={issue.priorities}
              issues={issue.issues}
              initialData={editingIssue}
              emitServerUpdate={emitServerUpdate}
              updateIssue={updateIssue}
              updateState={updateState}
              createIssue={createIssue}
              createState={createState}
            />
          )}
        </>
      }

      /* =======================
         MAIN VIEW
      ======================= */
      view={
        <>
          {/* ===== TREE VIEW ===== */}
          {viewMode === "tree" && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const draggedId = e.dataTransfer.getData("issueId");
                if (draggedId) onMoveIssue(draggedId, null);
              }}
            >
              {roots.map((root: any) => (
                <TreeView
                  key={`tree-${root.id}`}
                  task={root}
                  collapsed={collapsed}
                  toggleCollapse={toggleCollapse}
                  onMove={onMoveIssue}
                  handleContextMenu={handleContextMenu}
                  openIssue={(task) => {
                    setFocusedIssueId(task.id);
                    openIssue(task);
                  }}
                  membersServer={membersServer}
                  statusIcon={statusIcon}
                />
              ))}
            </div>
          )}

          {/* ===== CLUSTER VIEW ===== */}
          {viewMode === "cluster" && (
            <div className="flex">
            <ClusterView
              issues={issue.issues}
              focusedIssueId={focusedIssueId}
              setFocusedIssueId={setFocusedIssueId}
              activePath={activePath}
              handleContextMenu={handleContextMenu}
              openIssue={(task) => {
                setFocusedIssueId(task.id);
                openIssue(task);
              }}
              statusIcon={statusIcon}
            />
            {context && (
                <ClusterContextPanel
                  context={context}
                  onSelect={(id) => setFocusedIssueId(id)}
                />
              )}
            </div>
          )}
        </>
      }

      /* =======================
         ISSUE PANEL
      ======================= */
      issue={
        <>
          {issue.openIssue !== null && (
            <OpenIssue
              serverId={serverId}
              issueId={issue.openIssue}
              activeIssueChat={activeIssueChat}
            />
          )}
        </>
      }

      /* =======================
         CONTEXT MENU
      ======================= */
      menu={
        <AnimatedContextMenu
          visible={!!contextMenu}
          x={contextMenu?.x || 0}
          y={contextMenu?.y || 0}
          items={menuItems}
          menuRef={menuRef}
          onClose={closeMenu}
        />
      }

      /* =======================
         ASSIGN MODAL
      ======================= */
      assign={
        <>
          {assignModal.open && (
            <AssignModal
              issue={assignModal.issue}
              onClose={closeModalAssign}
              serverId={serverId}
              projectId={projectId}
              emitServerUpdate={emitServerUpdate}
            />
          )}
        </>
      }
    />
  );
};
