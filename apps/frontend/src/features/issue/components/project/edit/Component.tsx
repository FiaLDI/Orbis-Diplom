import React from "react";
import { ModalLayout } from "@/shared";
import { FormProvider } from "react-hook-form";
import { Ellipsis } from "lucide-react";
import { Props } from "./interface";
import { useProjectEditModel } from "@/features/issue/model/useProjectEditModel";
import { ProjectEditLayout } from "@/features/issue/ui/layout/ProjectEditLayout";
import { ProjectEditForm } from "@/features/issue/ui/form/ProjectEditForm";
import { ProjectEditHead } from "@/features/issue/ui/layout/ProjectEditHead";

export const ProjectEditModal: React.FC<Props> = ({
    projectId,
    serverId,
    projectName,
    projectDescription,
}) => {
    const { form, onSubmit, handleDelete, open, setOpen, updateState, removeState } =
        useProjectEditModel({
            projectId,
            serverId,
            projectName,
            projectDescription,
        });

    const { register, handleSubmit, formState } = form;
    const { errors } = formState;

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="cursor-pointer p-2 rounded text-sm hover:text-black"
            >
                <Ellipsis />
            </button>

            <ModalLayout open={open} onClose={() => setOpen(false)}>
                <ProjectEditLayout
                    head={<ProjectEditHead onClose={() => setOpen(false)} />}
                    form={
                        <FormProvider {...form}>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="p-5 flex flex-col gap-5"
                                autoComplete="off"
                            >
                                <ProjectEditForm
                                    updateState={updateState}
                                    removeState={removeState}
                                    onDelete={handleDelete}
                                />
                            </form>
                        </FormProvider>
                    }
                />
            </ModalLayout>
        </>
    );
};
