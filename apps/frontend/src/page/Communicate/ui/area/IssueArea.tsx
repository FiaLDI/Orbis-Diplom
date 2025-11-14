import React from "react";
import { IssueComponent, ProjectList } from "@/features/issue";

export const IssueArea = ({
    serverId,
    projectId,
    serverName,
}: {
    serverId?: string;
    projectId?: string;
    serverName?: string;
}) => {
    return projectId ? (
        <IssueComponent serverId={serverId} projectId={projectId} name={serverName} />
    ) : (
        <ProjectList serverId={serverId} name={serverName} />
    );
};
