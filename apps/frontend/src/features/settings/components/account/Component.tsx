import React from "react";
import { useAccountFormModel } from "../../model/useAccountFormModel";
import { FormInput } from "../../ui/field/FormInput";
import { SettingsLayout } from "../../ui/layout/SettingsLayout";
import { UserData } from "@/features/auth";

export const Component: React.FC<{user: UserData["info"]}> = ({user}) => {
  const { form, onSubmit, t, error, isLoading } = useAccountFormModel(user);
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  return (
    <SettingsLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <FormInput
              label={t("menu.account.form.field.username.label")}
              placeholder={t("menu.account.form.field.username.placeholder")}
              error={errors.username?.message}
              type="text"
              register={register("username", { required: "Введите имя" })}
          />

        <FormInput
            label={t("menu.account.form.field.email.label")}
            placeholder={t("menu.account.form.field.email.placeholder")}
            type="email"
            error={errors.email?.message}
            register={register("email", {
                pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: t("menu.account.form.field.email.invalid"),
                },
            })}
        />

        <FormInput
            label={t("menu.account.form.field.password.label")}
            placeholder={t("menu.account.form.field.password.placeholder")}
            type="password"
            error={errors.password?.message}
            register={register("password", {
                minLength: { value: 6, message: "Минимум 6 символов" },
            })}
        />

        <FormInput
            label={t("menu.account.form.field.number.label")}
            placeholder={t("menu.account.form.field.number.placeholder")}
            error={errors.number?.message}
            type="text"
            register={register("number", {
                pattern: {
                value: /^[0-9+()\s-]{7,20}$/,
                message: t("menu.account.form.field.number.invalid"),
                },
            })}
            />


        <button disabled={isLoading} className="submit-btn">
          {isLoading ? t("menu.account.form.loading") : t("menu.account.form.submit")}
        </button>

        {error && <div className="error-text">{(error as any).data?.message}</div>}
      </form>
    </SettingsLayout>
  );
};
