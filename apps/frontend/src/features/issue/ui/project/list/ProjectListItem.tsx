import React from "react";
import { ProjectEditModal } from "../edit";

interface Props {
  project: {
    id: string;
    name: string;
    description: string;
  };
  serverId: string;
  onOpen: (id: string) => void;
}

export const ProjectListItem: React.FC<Props> = ({
  project,
  serverId,
  onOpen,
}) => (
  <div className="bg-[#2d3dee]/5 flex w-full items-center justify-between">
    <div className="w-full">
      <button
        className="w-full p-5 bg-background/50 hover:bg-background text-left cursor-pointer"
        onClick={() => onOpen(project.id)}
      >
        {project.name}
      </button>
    </div>
    <div>
      <ProjectEditModal
        projectName={project.name}
        projectDescription={project.description}
        projectId={project.id}
        serverId={serverId}
      />
    </div>
  </div>
);
