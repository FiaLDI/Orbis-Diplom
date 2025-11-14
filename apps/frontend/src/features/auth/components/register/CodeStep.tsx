import React from "react";
import { FormInput, SubmitButton } from "@/shared/ui/Form";
import { CodeFormData } from "@/features/auth/validation";

interface Props {
  t: any;
  codeForm: any;
  handleSubmit: (data: CodeFormData) => void;
  disabled?: boolean;
}

export const CodeStep: React.FC<Props> = ({
  t,
  codeForm,
  handleSubmit,
  disabled,
}) => (
  <form
    className="flex flex-col gap-5"
    onSubmit={codeForm.handleSubmit(handleSubmit)}
    autoComplete="off"
  >
    <FormInput<CodeFormData>
      name="code"
      type="text"
      label={t("register.code.label")}
      placeholder={t("register.code.placeholder")}
      register={codeForm.register}
      error={codeForm.formState.errors.code}
      disabled={disabled}
    />
    <SubmitButton
      label={t("register.code.submit")}
      disabled={disabled}
      className="whitespace-nowrap "
    />
  </form>
);
