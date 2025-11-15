import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormInput,
  FormTextArea,
  FormSelect,
  SubmitButton,
  FormError,
} from "@/shared/ui/Form";
import { IssueFormData } from "@/features/issue/types";

interface Props {
  updateState: any;
  createState: any;
  onClose: () => void;
  statuses: { id: number; name: string }[];
  priorities: string[];
  issues: any[];
  isEditing: boolean;
  initialData?: any | null;
}

export const IssueEditForm: React.FC<Props> = ({
  updateState,
  createState,
  onClose,
  statuses,
  priorities,
  issues,
  isEditing,
  initialData,
}) => {
  const { register, watch, setValue, formState } =
    useFormContext<IssueFormData>();
  const { errors } = formState;

  return (
    <>
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
          ...statuses.map((s) => ({ label: s.name, value: s.id })),
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
          onClick={onClose}
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
    </>
  );
};
