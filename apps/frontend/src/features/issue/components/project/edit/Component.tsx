import React from "react";
import { ModalLayout } from "@/shared";
import { useForm, SubmitHandler } from "react-hook-form";
import { Ellipsis, X } from "lucide-react";
import { useEmitServerUpdate } from "@/features/server";
import { useDeleteProjectMutation, useUpdateProjectMutation } from "@/features/issue";
import { Props } from "./interface";
import { ProjectEditFormData } from "./interface";

import { FormInput, FormTextArea, SubmitButton, FormError } from "@/shared/ui/Form";

export const ProjectEditModal: React.FC<Props> = ({
    projectId,
    serverId,
    projectName,
    projectDescription,
}) => {
    const [open, setOpen] = React.useState(false);
    const emitServerUpdate = useEmitServerUpdate();
    const [updateProject, updateState] = useUpdateProjectMutation();
    const [removeProject, removeState] = useDeleteProjectMutation();

    const form = useForm<ProjectEditFormData>({
        defaultValues: {
            name: projectName || "",
            description: projectDescription || "",
        },
    });

    const { register, handleSubmit, formState } = form;
    const { errors } = formState;

    const onSubmit: SubmitHandler<ProjectEditFormData> = async (data) => {
        if (!data.name.trim() || !data.description.trim()) return;

        try {
            await updateProject({ projectId, serverId, data }).unwrap();
            emitServerUpdate(serverId);
            setOpen(false);
        } catch (err) {
            console.error("Ошибка при обновлении проекта:", err);
        }
    };

    const handleDelete = async () => {
        try {
            await removeProject({ serverId, projectId }).unwrap();
            emitServerUpdate(serverId);
            setOpen(false);
        } catch (err) {
            console.error("Ошибка при удалении проекта:", err);
        }
    };

    return (
        <>
            {/* Кнопка открытия */}
            <button
                onClick={() => setOpen(true)}
                className="cursor-pointer p-2 rounded text-sm hover:text-black"
            >
                <Ellipsis />
            </button>

            {/* Модалка */}
            <ModalLayout open={open} onClose={() => setOpen(false)}>
                <div className="p-0 w-[420px] text-white">
                    {/* Заголовок */}
                    <div className="bg-background w-full rounded flex items-center justify-between p-5">
                        <div className="font-semibold text-lg">Project editor</div>
                        <button className="cursor-pointer p-0 w-fit" onClick={() => setOpen(false)}>
                            <X />
                        </button>
                    </div>

                    {/* Форма */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="p-5 flex flex-col gap-5"
                        autoComplete="off"
                    >
                        {/* Название проекта */}
                        <FormInput<ProjectEditFormData>
                            name="name"
                            label="Project name"
                            placeholder="Enter project name"
                            register={register}
                            validation={{ required: "Name is required" }}
                            error={errors.name}
                        />

                        {/* Описание проекта */}
                        <FormTextArea<ProjectEditFormData>
                            name="description"
                            label="Project description"
                            placeholder="Enter project description"
                            register={register}
                            validation={{ required: "Description is required" }}
                            error={errors.description}
                        />

                        {/* Ошибки */}
                        <FormError
                            message={
                                (updateState.error as any)?.data?.message ||
                                (removeState.error as any)?.data?.message
                            }
                        />

                        {/* Кнопки */}
                        <div className="flex gap-3 mt-2">
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={removeState.isLoading}
                                className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded text-white disabled:opacity-60"
                            >
                                {removeState.isLoading ? "Deleting..." : "Delete"}
                            </button>

                            <SubmitButton
                                label={updateState.isLoading ? "Saving..." : "Save"}
                                loading={updateState.isLoading}
                                className="flex-1"
                            />
                        </div>
                    </form>
                </div>
            </ModalLayout>
        </>
    );
};
