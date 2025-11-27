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
      className="
        p-10 
        rounded-2xl 
        w-[450px]
        text-white 
        flex flex-col items-center
        
        /* стеклянный фон */
        bg-[rgba(10,20,40,0.45)]
        backdrop-blur-xl
        
        /* неон */
        border border-cyan-300/20
        shadow-[0_0_25px_rgba(0,200,255,0.15)]
      "
    >
      <form
        onSubmit={login.handleSubmit(login.onSubmit)}
        autoComplete="off"
        className="flex flex-col gap-6 w-full animate-[fadeIn_0.8s_ease-out]"
      >
        <h1
          className="
            text-3xl text-center font-semibold tracking-wide
            drop-shadow-[0_0_12px_rgba(0,255,255,0.45)]
          "
        >
          {t("login.title")}
        </h1>

        {/* Email */}
        <FormInput<LoginFormData>
          name="email"
          type="email"
          label={t("login.email")}
          placeholder={t("login.email")}
          register={login.register}
          error={login.errors.email}
          className="text-white"
        />

        {/* Password */}
        <FormInput<LoginFormData>
          name="password"
          type="password"
          label={t("login.password")}
          placeholder={t("login.password")}
          register={login.register}
          error={login.errors.password}
          className="text-white"
        />

        {/* Submit */}
        <SubmitButton
          label={t("login.submit")}
          loading={login.isLoading}
          className="
            mt-3
            bg-[rgba(0,255,255,0.1)]
            border border-cyan-300/40
            hover:border-cyan-300
            hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]
            hover:text-cyan-200
            transition-all 
          "
        />

        {/* Server error */}
        <FormError
          message={(login.error as any)?.data?.message}
        />

        {/* Link to register */}
        <span className="text-center text-sm text-white/60 mt-2">
          <a
            href="#"
            className="
              underline 
              hover:text-cyan-300 
              transition-all
              drop-shadow-[0_0_6px_rgba(0,255,255,0.4)]
            "
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
