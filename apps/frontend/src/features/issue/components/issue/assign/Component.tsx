import React from "react";
import { ModalLayout } from "@/shared";
import { Props } from "./interface";
import { useIssueAssignModel } from "@/features/issue/model/useIssueAssignModel";
import { IssueAssignLayout } from "@/features/issue/ui/layout/IssueAssignLayout";
import { IssueAssignHead } from "@/features/issue/ui/layout/IssueAssignHead";
import { IssueAssignList } from "./IssueAssignList";

export const Component: React.FC<Props> = ({
    serverId,
    projectId,
    issue,
    onClose,
    emitServerUpdate,
}) => {
    const {
        search,
        setSearch,
        filteredMembers,
        localAssigned,
        loadingId,
        handleAssign,
        handleUnassign,
    } = useIssueAssignModel(serverId, projectId, issue, emitServerUpdate);

    return (
        <ModalLayout open={!!issue} onClose={onClose}>
            <IssueAssignLayout
                head={<IssueAssignHead title="Manage Assignees" onClose={onClose} />}
                search={
                    <input
                        type="text"
                        placeholder="Search member..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border rounded px-2 py-1 text-black"
                    />
                }
                result={
                    <IssueAssignList
                        members={filteredMembers}
                        assignedIds={localAssigned}
                        loadingId={loadingId}
                        onAssign={handleAssign}
                        onUnassign={handleUnassign}
                    />
                }
            />
        </ModalLayout>
    );
};
