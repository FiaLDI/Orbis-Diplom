import React from "react";
import { FormInput, SubmitButton } from "@/shared/ui/Form";
import { EmailFormData } from "@/features/auth/validation";

interface Props {
  t: any;
  emailForm: any;
  handleSubmit: (data: EmailFormData) => void;
  disabled?: boolean;
}

export const EmailStep: React.FC<Props> = ({
  t,
  emailForm,
  handleSubmit,
  disabled,
}) => (
  <form
    className="flex flex-col gap-6 w-full animate-[fadeIn_0.5s_ease-out]"
    onSubmit={emailForm.handleSubmit(handleSubmit)}
    autoComplete="off"
  >
    <div className="flex items-end gap-3">
      <FormInput<EmailFormData>
        name="email"
        type="email"
        placeholder={t("register.email.placeholder")}
        label={t("register.email.label")}
        disabled={disabled}
        register={emailForm.register}
        error={emailForm.formState.errors.email}
        className="text-white"
      />

      <SubmitButton
        label={t("register.email.submit")}
        disabled={disabled}
        className="
          h-[50px]
          bg-[rgba(0,255,255,0.1)]
          border border-cyan-300/40
          hover:border-cyan-300
          hover:text-cyan-300
          hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]
          transition-all
          whitespace-nowrap
        "
      />
    </div>
  </form>
);
