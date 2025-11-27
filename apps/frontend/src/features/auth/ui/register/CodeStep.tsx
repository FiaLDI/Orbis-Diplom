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
    className="flex flex-col gap-6 w-full animate-[fadeIn_0.5s_ease-out]"
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
      className="text-white"
    />

    <SubmitButton
      label={t("register.code.submit")}
      disabled={disabled}
      className="
        bg-[rgba(0,255,255,0.1)]
        border border-cyan-300/40
        hover:border-cyan-300
        hover:text-cyan-300
        hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]
        transition-all
      "
    />
  </form>
);
