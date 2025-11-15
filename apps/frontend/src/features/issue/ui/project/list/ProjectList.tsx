import React from "react";
import { MoveLeft, Plus } from "lucide-react";
import { useProjectListModel } from "@/features/issue/hooks";
import { ProjectListItem } from "./ProjectListItem";
import { ProjectListLayout } from "@/features/issue/ui/layout/ProjectListLayout";

export const ProjectList: React.FC<{
  serverId?: string;
  name?: string;
}> = ({ serverId, name }) => {
  const { projects, handleProject, handlerCreateProject, open } =
    useProjectListModel(serverId);

  if (!serverId || !name) return null;

  const header = (
    <div className="bg-background p-5 flex w-full justify-between items-center">
      <h4 className="truncate text-lg text-white w-full flex items-center gap-5">
        <button
          className="cursor-pointer"
          aria-label="Back"
          onClick={handleProject}
        >
          <MoveLeft />
        </button>
        Projects {name}
      </h4>
      <button
        className="cursor-pointer px-1 py-1 bg-foreground rounded-full"
        onClick={handlerCreateProject}
      >
        <Plus color="white" />
      </button>
    </div>
  );

  const body = (
    <div className="h-full w-full flex flex-col text-white bg-background/50">
      {projects.map((project: any, index: number) => (
        <ProjectListItem
          key={`projects-${project.id}-${index}`}
          project={project}
          serverId={serverId}
          onOpen={open}
        />
      ))}
    </div>
  );

  return <ProjectListLayout header={header} body={body} />;
};
