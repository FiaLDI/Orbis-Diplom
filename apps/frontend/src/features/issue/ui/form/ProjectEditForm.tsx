import React from "react";
import { useFormContext } from "react-hook-form";
import { ProjectEditFormData } from "@/features/issue/types";
import {
  FormInput,
  FormTextArea,
  SubmitButton,
  FormError,
} from "@/shared/ui/Form";
import { useTranslation } from "react-i18next";

interface Props {
  updateState: any;
  removeState: any;
  onDelete: () => void;
}

export const ProjectEditForm: React.FC<Props> = ({
  updateState,
  removeState,
  onDelete,
}) => {
  const { register, handleSubmit, formState } =
    useFormContext<ProjectEditFormData>();
  const { errors } = formState;
  const { t } = useTranslation("project");

  return (
    <>
      <FormInput<ProjectEditFormData>
        name="name"
        label={t("name")}
        placeholder={t("enter_name")}
        register={register}
        validation={{ required: t("required_name") }}
        error={errors.name}
      />

      <FormTextArea<ProjectEditFormData>
        name="description"
        label={t("description")}
        placeholder={t("enter_description")}
        register={register}
        validation={{ required: t("required_description") }}
        error={errors.description}
      />

      <FormError
        message={
          (updateState.error as any)?.data?.message ||
          (removeState.error as any)?.data?.message
        }
      />

      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onDelete}
          disabled={removeState.isLoading}
          className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded text-white disabled:opacity-60"
        >
          {removeState.isLoading ? t("deleting") : t("delete")}
        </button>

        <SubmitButton
          label={updateState.isLoading ? t("saving") : t("save")}
          loading={updateState.isLoading}
          className="flex-1"
        />
      </div>
    </>
  );
};
