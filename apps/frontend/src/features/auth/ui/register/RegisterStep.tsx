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
    className="
      flex flex-col gap-6
      animate-[fadeIn_0.5s_ease-out]
    "
  >
    {/* Username */}
    <FormInput<RegisterFormData>
      name="username"
      type="text"
      label={t("register.register.username")}
      placeholder={t("register.register.username")}
      register={registerForm.register}
      error={registerForm.formState.errors.username}
      className="text-white"
    />

    {/* Password */}
    <FormInput<RegisterFormData>
      name="password"
      type="password"
      label={t("register.register.password")}
      placeholder={t("register.register.password")}
      register={registerForm.register}
      error={registerForm.formState.errors.password}
      className="text-white"
    />

    {/* Birth date */}
    <FormInput<RegisterFormData>
      name="birth_date"
      type="date"
      label={t("register.register.birth_date")}
      placeholder={t("register.register.birth_date")}
      register={registerForm.register}
      error={registerForm.formState.errors.birth_date}
      className="text-white"
    />

    {/* Submit */}
    <SubmitButton
      label={t("register.register.submit")}
      className="
        bg-[rgba(0,255,255,0.1)]
        border border-cyan-300/40
        hover:border-cyan-300
        hover:text-cyan-300
        hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]
        transition-all
      "
    />

    <FormError
      message={isError ? t("register.error") : undefined}
    />
  </form>
);
