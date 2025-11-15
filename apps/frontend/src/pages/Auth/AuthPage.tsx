import React from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm, RegisterForm } from "@/features/auth";
import { useTranslation } from "react-i18next";

export const AuthPage: React.FC<{ type: string }> = ({ type }) => {
  const navigator = useNavigate();
  const { t } = useTranslation("auth");

  return (
    <>
      <div
        className="fixed top-5 left-5 text-white cursor-pointer p-5"
        onClick={() => navigator("/")}
      >
        На главную
      </div>
      <div className="flex justify-center items-center w-screen h-screen ">
        {type === "login" ? <LoginForm t={t} /> : null}
        {type === "register" ? <RegisterForm t={t} /> : null}
      </div>
    </>
  );
};
