import React from "react";
import { Props } from "./interface";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { MoveLeft, Plus, Target } from "lucide-react";
import { useCreateProjectMutation, useLazyGetIssuesQuery } from "../../api";
import { Component as EditProject } from "./edit";
import { setOpenProject, toggleIssueMode } from "../..";
import { useEmitServerUpdate } from "@/features/server";

export const Component: React.FC<Props> = ({ serverid, name }) => {
    const projects = useAppSelector((s) => s.issue.project);
    const dispatch = useAppDispatch();

    const [createProject] = useCreateProjectMutation();
    const [getIssue] = useLazyGetIssuesQuery();
    const emitServerUpdate = useEmitServerUpdate();

    const handlerCreateProject = async () => {
        if (!serverid) return;
        try {
            await createProject({
                id: serverid,
                data: { name: "default", description: "default" },
            }).unwrap();

            emitServerUpdate(serverid); // ✅ уведомляем всех клиентов
        } catch (err) {
            console.error("Ошибка при создании проекта:", err);
        }
    };

    const open = (id: number) => {
        dispatch(setOpenProject(id));

        getIssue(id);
    };

    const handleProject = () => {
        dispatch(toggleIssueMode());
    };

    if (!serverid) return null;
    if (!name) return null;
    return (
        <div className="h-full w-full overflow-y-auto scroll-hidden">
            <div className="bg-background p-5 flex w-full justify-between items-center">
                <h4 className="truncate text-lg  text-white w-full flex items-center gap-5">
                    <button className="cursor-pointer" aria-label="Target" onClick={handleProject}>
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
            <div className="h-full w-full flex flex-col text-white bg-background/50">
                {projects.map((val: any, index: number) => {
                    return (
                        <div
                            key={`projects-${val.id}-${index}`}
                            className=" bg-[#2d3dee]/5 flex w-full items-center justify-between"
                        >
                            <div className="w-full ">
                                <button
                                    className="w-full p-5 bg-background/50 hover:bg-background text-left cursor-pointer"
                                    onClick={() => open(val.id)}
                                >
                                    {val.name}
                                </button>
                            </div>
                            <div className="">
                                <EditProject
                                    projectName={val.name}
                                    projectDescription={val.description}
                                    projectId={val.id}
                                    serverId={serverid}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
