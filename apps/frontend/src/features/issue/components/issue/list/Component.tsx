import React, { useState } from "react";
import { IssueFormModal } from "../create";
import { Component as OpenIssue } from "../open";
import { Component as AssignModal } from "../assign";
import { AnimatedContextMenu } from "@/shared/ui";
import { useContextMenu } from "@/shared/hooks";
import { useIssueQuery } from "@/features/issue/model/useIssueQuery";
import { useIssueModel } from "@/features/issue/model/useIssueModel";
import { useIssueEditModal } from "@/features/issue/model/useIssueEditModel";
import { IssueListLayout } from "@/features/issue/ui/layout/IssueListLayout";
import { BackButton } from "@/features/issue/ui/button/BackButton";
import { IssueListHead } from "@/features/issue/ui/layout/IssueListHead";
import { ChangeViewLayout } from "@/features/issue/ui/layout/ChangeViewLayout";
import { CreateButton } from "@/features/issue/ui/button/CreateButton";
import { ClusterView } from "@/features/issue/ui/view/ClusterView";
import { TreeView } from "@/features/issue/ui/view/TreeView";
import { useIssueAdditionsModel } from "@/features/issue/model/useIssueAdditonsModel";
import { useIssueAssignModal } from "@/features/issue/model/useIssueAssignModal";

interface Props {
  serverId?: string;
  name?: string;
  projectId?: string;
}

export const Component: React.FC<Props> = ({ serverId, name, projectId }) => {
  const { open, editingIssue, openModal, closeModal } = useIssueEditModal();

  const [viewMode, setViewMode] = useState<"tree" | "cluster">("tree");

  const { assignModal, closeModalAssign, setAssignModalHandler } =
    useIssueAssignModal();

  const { contextMenu, handleContextMenu, closeMenu, menuRef } =
    useContextMenu<any>();

  const {
    updateState,
    createState,
    deleteIssue,
    getIssues,
    updateIssue,
    createIssue,
    emitServerUpdate,
  } = useIssueQuery(serverId, projectId, closeMenu);

  const { issue, activeIssueChat, membersServer, openIssue, back } =
    useIssueModel();

  const { statusIcon, menuItems } = useIssueAdditionsModel({
    contextMenu,
    openModal,
    setAssignModalHandler,
    closeMenu,
    deleteIssue,
  });

  if (!serverId || !name || !projectId) return null;

  return (
    <IssueListLayout
      back={<BackButton handler={back} />}
      head={<IssueListHead name={name} projectId={projectId} />}
      viewChange={
        <ChangeViewLayout setViewMode={setViewMode} viewMode={viewMode} />
      }
      createIssue={<CreateButton handler={() => openModal()} />}
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
      view={
        <>
          {viewMode === "tree" &&
            issue.issues
              .filter((i: any) => !i.parent_id)
              .map((root: any) => (
                <TreeView
                  key={`tree-${root.id}`}
                  task={root}
                  handleContextMenu={handleContextMenu}
                  openIssue={openIssue}
                  membersServer={membersServer}
                  statusIcon={statusIcon}
                />
              ))}

          {viewMode === "cluster" &&
            issue.issues
              .filter((i: any) => !i.parent_id)
              .map((root: any) => (
                <ClusterView
                  key={`cluster-${root.id}`}
                  task={root}
                  handleContextMenu={handleContextMenu}
                  openIssue={openIssue}
                  membersServer={membersServer}
                  statusIcon={statusIcon}
                />
              ))}
        </>
      }
      issue={
        <>
          {issue.openIssue !== null && (
            <OpenIssue
              projectId={projectId}
              serverId={serverId}
              issueId={issue.openIssue}
              issues={issue.issues}
              activeIssueChat={activeIssueChat}
            />
          )}
        </>
      }
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
