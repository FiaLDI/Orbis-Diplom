import React from "react";
import { IssueAssignItem } from "./IssueAssignItem";

interface Props {
    members: any[];
    assignedIds: string[];
    loadingId: string | null;
    onAssign: (id: string) => void;
    onUnassign: (id: string) => void;
}

export const IssueAssignList: React.FC<Props> = ({
    members,
    assignedIds,
    loadingId,
    onAssign,
    onUnassign,
}) => {
    if (members.length === 0) {
        return <p className="text-gray-400 text-center">No members found</p>;
    }

    return (
        <>
            {members.map((member) => (
                <IssueAssignItem
                    key={member.id}
                    member={member}
                    isAssigned={assignedIds.includes(member.id)}
                    loading={loadingId === member.id}
                    onAssign={onAssign}
                    onUnassign={onUnassign}
                />
            ))}
        </>
    );
};
