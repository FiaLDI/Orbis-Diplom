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
    className="flex flex-col gap-5 w-full"
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
      />
      <SubmitButton label={t("register.email.submit")} disabled={disabled} />
    </div>
  </form>
);
