import { MoveLeft } from "lucide-react";
import React from "react";

export const IssueListHead: React.FC<{
  name: string;
  projectId: string;
}> = ({ name, projectId }) => (
  <div>
    {name} Issues for {projectId}
  </div>
);
