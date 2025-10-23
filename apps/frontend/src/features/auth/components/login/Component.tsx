import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginUserMutation } from "../../api";
import { useNavigate } from "react-router-dom";
import { InputField, SubmitButton } from "../fields";
import { useTranslation } from "react-i18next";
import { LoginFormData, loginSchema } from "../../validation";

export const Component: React.FC = () => {
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
        <div className="p-10 lg:p-10 rounded-md bg-background/30 text-white w-[450px]">
            <form
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
                className="flex flex-col gap-5"
            >
                <h1 className="text-2xl text-center">{t("login.title")}</h1>

                <InputField<LoginFormData>
                    type="email"
                    placeholder={t("login.email")}
                    name="email"
                    register={register}
                    error={errors.email}
                />

                <InputField<LoginFormData>
                    type="password"
                    placeholder={t("login.password")}
                    name="password"
                    register={register}
                    error={errors.password}
                />

                <SubmitButton label={t("login.submit")} disabled={isLoading} />

                {error && (
                    <div className="text-red-400 text-center mt-2">
                        Ошибка: {(error as any).data?.message}
                    </div>
                )}

                <span className="text-center">
                    <a
                        href=""
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
