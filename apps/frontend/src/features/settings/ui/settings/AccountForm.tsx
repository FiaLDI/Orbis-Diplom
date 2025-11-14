import React from "react";
import { SettingsLayout } from "../../ui/layout/SettingsLayout";
import { UserData } from "@/features/auth";

import { FormInput, SubmitButton, FormError } from "@/shared/ui/Form";
import { useAccountFormModel } from "@/features/settings/hooks";
import { AccountFormData } from "../../types";

export const AccountForm: React.FC<{ user: UserData["info"] }> = ({ user }) => {
  const { form, onSubmit, t, error, isLoading } = useAccountFormModel(user);
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  return (
    <SettingsLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-8 w-full max-w-xl"
      >
        <h2 className="text-xl font-semibold mb-2">
          {t("menu.account.title")}
        </h2>

        {/* username */}
        <FormInput<AccountFormData>
          name="username"
          type="text"
          label={t("menu.account.form.field.username.label")}
          placeholder={t("menu.account.form.field.username.placeholder")}
          register={register}
          validation={{
            required: t("menu.account.form.field.username.required"),
          }}
          error={errors.username}
        />

        {/* email */}
        <FormInput<AccountFormData>
          name="email"
          type="email"
          label={t("menu.account.form.field.email.label")}
          placeholder={t("menu.account.form.field.email.placeholder")}
          register={register}
          validation={{
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: t("menu.account.form.field.email.invalid"),
            },
          }}
          error={errors.email}
        />

        {/* password */}
        <FormInput<AccountFormData>
          name="password"
          type="password"
          label={t("menu.account.form.field.password.label")}
          placeholder={t("menu.account.form.field.password.placeholder")}
          register={register}
          validation={{
            minLength: {
              value: 6,
              message: t("menu.account.form.field.password.minLength"),
            },
          }}
          error={errors.password}
        />

        {/* number */}
        <FormInput<AccountFormData>
          name="number"
          type="text"
          label={t("menu.account.form.field.number.label")}
          placeholder={t("menu.account.form.field.number.placeholder")}
          register={register}
          validation={{
            pattern: {
              value: /^[0-9+()\s-]{7,20}$/,
              message: t("menu.account.form.field.number.invalid"),
            },
          }}
          error={errors.number}
        />

        <SubmitButton
          label={
            isLoading
              ? t("menu.account.form.loading")
              : t("menu.account.form.submit")
          }
          loading={isLoading}
        />

        <FormError message={(error as any)?.data?.message} />
      </form>
    </SettingsLayout>
  );
};
