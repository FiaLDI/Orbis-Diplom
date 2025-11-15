import React from "react";
import { FormInput, SubmitButton, FormError } from "@/shared/ui/Form";
import { RegisterFormData } from "@/features/auth/validation";

interface Props {
  t: any;
  registerForm: any;
  handleSubmit: (data: RegisterFormData) => void;
  isError?: boolean;
}

export const RegisterStep: React.FC<Props> = ({
  t,
  registerForm,
  handleSubmit,
  isError,
}) => (
  <form
    onSubmit={registerForm.handleSubmit(handleSubmit)}
    autoComplete="off"
    className="flex flex-col gap-6"
  >
    <FormInput<RegisterFormData>
      name="username"
      type="text"
      label={t("register.register.username")}
      placeholder={t("register.register.username")}
      register={registerForm.register}
      error={registerForm.formState.errors.username}
    />

    <FormInput<RegisterFormData>
      name="password"
      type="password"
      label={t("register.register.password")}
      placeholder={t("register.register.password")}
      register={registerForm.register}
      error={registerForm.formState.errors.password}
    />

    <FormInput<RegisterFormData>
      name="birth_date"
      type="date"
      label={t("register.register.birth_date")}
      placeholder={t("register.register.birth_date")}
      register={registerForm.register}
      error={registerForm.formState.errors.birth_date}
    />

    <SubmitButton label={t("register.register.submit")} />
    <FormError message={isError ? t("register.error") : undefined} />
  </form>
);
