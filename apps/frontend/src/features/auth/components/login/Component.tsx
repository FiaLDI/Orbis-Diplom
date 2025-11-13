import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginUserMutation } from "@/features/auth/api";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LoginFormData, loginSchema } from "@/features/auth/validation";

import { FormInput, SubmitButton, FormError } from "@/shared/ui/Form";

export const LoginForm: React.FC = () => {
    const { t } = useTranslation("auth");
    const navigate = useNavigate();
    const [login, { isLoading, error }] = useLoginUserMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
        try {
            await login(data).unwrap();
        } catch (err) {
            console.error("Login error:", err);
        }
    };

    return (
        <div
            className={
                "p-10 rounded-md bg-background/30 text-white w-[450px] flex flex-col items-center"
            }
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
                className="flex flex-col gap-5 w-full"
            >
                <h1 className="text-2xl text-center font-semibold">{t("login.title")}</h1>

                <FormInput<LoginFormData>
                    name="email"
                    type="email"
                    label={t("login.email")}
                    placeholder={t("login.email")}
                    register={register}
                    error={errors.email}
                />

                <FormInput<LoginFormData>
                    name="password"
                    type="password"
                    label={t("login.password")}
                    placeholder={t("login.password")}
                    register={register}
                    error={errors.password}
                />

                <SubmitButton label={t("login.submit")} loading={isLoading} />

                <FormError message={(error as any)?.data?.message} />

                <span className="text-center text-sm text-white/70 mt-2">
                    <a
                        href="#"
                        className="underline hover:text-white"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate("/register");
                        }}
                    >
                        {t("login.register")}
                    </a>
                </span>
            </form>
        </div>
    );
};
