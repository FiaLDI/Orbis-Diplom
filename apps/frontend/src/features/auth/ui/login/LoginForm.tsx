import React from "react";
import { LoginFormData } from "@/features/auth/validation";

import { FormInput, SubmitButton, FormError } from "@/shared/ui/Form";
import { TFunction } from "i18next";
import { useLoginModel } from "@/features/auth/hooks";

export const LoginForm: React.FC<{ t: TFunction<"server", undefined> }> = ({
  t,
}) => {
  const login = useLoginModel();

  return (
    <div
      className={
        "p-10 rounded-md bg-background/30 text-white w-[450px] flex flex-col items-center"
      }
    >
      <form
        onSubmit={login.handleSubmit(login.onSubmit)}
        autoComplete="off"
        className="flex flex-col gap-5 w-full"
      >
        <h1 className="text-2xl text-center font-semibold">
          {t("login.title")}
        </h1>

        <FormInput<LoginFormData>
          name="email"
          type="email"
          label={t("login.email")}
          placeholder={t("login.email")}
          register={login.register}
          error={login.errors.email}
        />

        <FormInput<LoginFormData>
          name="password"
          type="password"
          label={t("login.password")}
          placeholder={t("login.password")}
          register={login.register}
          error={login.errors.password}
        />

        <SubmitButton label={t("login.submit")} loading={login.isLoading} />

        <FormError message={(login.error as any)?.data?.message} />

        <span className="text-center text-sm text-white/70 mt-2">
          <a
            href="#"
            className="underline hover:text-white"
            onClick={(e) => {
              e.preventDefault();
              login.navigate("/register");
            }}
          >
            {t("login.register")}
          </a>
        </span>
      </form>
    </div>
  );
};
