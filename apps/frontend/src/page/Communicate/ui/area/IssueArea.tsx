import React from "react";
import { IssueComponent, ProjectComponent } from "@/features/issue";

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
        <ProjectComponent serverId={serverId} name={serverName} />
    );
};
