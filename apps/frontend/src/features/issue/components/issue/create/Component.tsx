import React, { useEffect, useState } from "react";
import { ModalLayout } from "@/shared";
import {
  useCreateIssueMutation,
  useUpdateIssueMutation,
  useLazyGetIssuesQuery,
  selectAllIssues,
} from "@/features/issue";
import { useAppSelector } from "@/app/hooks";
import { Plus, X } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { IssueFormData } from "./interface";

import {
  FormInput,
  FormTextArea,
  FormSelect,
  SubmitButton,
  FormError,
} from "@/shared/ui/Form";

interface FormProps {
  projectId: string;
  serverId: string;
  statuses: { id: number; name: string }[];
  priorities: string[];
  initialData?: any | null;
  onClose?: () => void;
}

export const IssueFormModal: React.FC<FormProps> = ({
  projectId,
  serverId,
  statuses,
  priorities,
  initialData = null,
  onClose,
}) => {
  const [open, setOpen] = useState(false);
  const [createIssue, createState] = useCreateIssueMutation();
  const [updateIssue, updateState] = useUpdateIssueMutation();
  const [getIssues] = useLazyGetIssuesQuery();
  const issues = useAppSelector(selectAllIssues);

  const form = useForm<IssueFormData>({
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      statusId: initialData?.status_id ?? statuses?.[0]?.id ?? 0,
      priority: initialData?.priority ?? "",
      due_date: initialData?.due_date
        ? new Date(initialData.due_date).toISOString().slice(0, 10)
        : "",
      parent_id: initialData?.parent_id ?? null,
    },
  });

  const { register, handleSubmit, watch, setValue, formState } = form;
  const { errors } = formState;

  const isEditing = !!initialData;

  const handleClose = () => {
    setOpen(false);
    form.reset();
    onClose?.();
    getIssues({ serverId, projectId });
  };

  const onSubmit: SubmitHandler<IssueFormData> = async (data) => {
    if (!data.title.trim() || !data.priority || !data.statusId) return;

    try {
      const payload = {
        title: data.title,
        description: data.description,
        statusId: Number(data.statusId),
        priority: data.priority,
        due_date: data.due_date ? new Date(data.due_date).toISOString() : null,
        parent_id: data.parent_id || null,
      };

      if (isEditing) {
        await updateIssue({
          serverId,
          projectId,
          issueId: initialData.id,
          data: payload,
        }).unwrap();
      } else {
        await createIssue({
          serverId,
          projectId,
          data: payload,
        }).unwrap();
      }

      handleClose();
    } catch (err) {
      console.error("Failed to save issue:", err);
    }
  };

  useEffect(() => {
    if (!initialData && statuses.length > 0) {
      setValue("statusId", statuses[0].id);
    }
  }, [statuses]);

  return (
    <>
      {!isEditing && (
        <button
          onClick={() => setOpen(true)}
          className="cursor-pointer rounded text-sm hover:text-black"
        >
          <Plus />
        </button>
      )}

      <ModalLayout open={open || isEditing} onClose={handleClose}>
        <div className="text-white w-[500px]">
          {/* Header */}
          <div className="bg-background w-full rounded flex items-center justify-between p-5">
            <div className="w-full font-semibold text-lg">
              {isEditing ? "Edit Issue" : "Create Issue"}
            </div>
            <button className="cursor-pointer p-0 w-fit" onClick={handleClose}>
              <X />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-5 flex flex-col gap-5"
            autoComplete="off"
          >
            <FormInput<IssueFormData>
              name="title"
              label="Issue title"
              placeholder="Enter issue title"
              register={register}
              validation={{ required: "Title is required" }}
              error={errors.title}
            />

            <FormTextArea<IssueFormData>
              name="description"
              label="Issue description"
              placeholder="Enter issue description"
              register={register}
              validation={{ required: "Description is required" }}
              error={errors.description}
            />

            <FormSelect<IssueFormData>
              name="statusId"
              label="Status"
              setValue={setValue}
              value={watch("statusId")}
              error={errors.statusId}
              options={[
                { label: "-- Select status --", value: "" },
                ...statuses.map((s) => ({
                  label: s.name,
                  value: s.id,
                })),
              ]}
            />

            <FormSelect<IssueFormData>
              name="priority"
              label="Priority"
              setValue={setValue}
              value={watch("priority") ?? ""}
              error={errors.priority}
              options={priorities.map((p) => ({ label: p, value: p }))}
            />

            <FormInput<IssueFormData>
              name="due_date"
              type="date"
              label="Due date"
              register={register}
              error={errors.due_date}
            />

            <FormSelect<IssueFormData>
              name="parent_id"
              label="Parent issue"
              setValue={setValue}
              value={watch("parent_id") ?? ""}
              error={errors.parent_id as any}
              options={[
                { label: "-- No parent --", value: "" },
                ...issues
                  .filter((iss: any) => iss.id !== initialData?.id)
                  .map((iss: any) => ({ label: iss.title, value: iss.id })),
              ]}
            />

            <FormError
              message={
                (createState.error as any)?.data?.message ||
                (updateState.error as any)?.data?.message
              }
            />

            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-background/60 text-white py-2 rounded hover:bg-background disabled:opacity-50"
              >
                Cancel
              </button>

              <SubmitButton
                label={isEditing ? "Save" : "Create"}
                loading={createState.isLoading || updateState.isLoading}
                className="flex-1"
              />
            </div>
          </form>
        </div>
      </ModalLayout>
    </>
  );
};
