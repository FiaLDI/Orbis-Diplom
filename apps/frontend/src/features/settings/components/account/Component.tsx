import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAppSelector } from "@/app/hooks";
import { useUpdateAccountMutation } from "@/features/settings";
import { FormData } from "./interface";
import { useTranslation } from "react-i18next";

export const Component: React.FC = () => {
    const user = useAppSelector((s) => s.auth.user?.info);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            username: user?.username || "",
            email: user?.email || "",
            password: "",
            number: user?.number || "",
        },
    });

    const { t } = useTranslation("settings");

    const [updateAccount, { isLoading, error }] = useUpdateAccountMutation();

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            if (!user?.id) return;

            const cleaned = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== ""));

            await updateAccount({ id: user.id, data: cleaned }).unwrap();
        } catch (err) {
            console.error("Update account error:", err);
        }
    };

    return (
        <div className="p-5 bg-foreground/30 text-white rounded-lg">
            <form
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
                className="flex flex-col gap-8"
            >
                <div>
                    <label className="block mb-2">
                        {t("menu.account.form.field.username.label")}
                    </label>
                    <input
                        type="text"
                        {...register("username", { required: "Введите имя" })}
                        placeholder={t("menu.account.form.field.username.placeholder")}
                        className="w-full rounded border border-[#ffffff22] bg-transparent p-2 focus:outline-none focus:border-white"
                    />
                    {errors.username && (
                        <span className="text-red-400 text-sm">{errors.username.message}</span>
                    )}
                </div>

                <div>
                    <label className="block mb-2">{t("menu.account.form.field.email.label")}</label>
                    <input
                        type="email"
                        {...register("email", {
                            required: user?.email ? "Введите email" : false,
                            pattern: {
                                value: /^\S+@\S+\.\S+$/,
                                message: "Неверный формат email",
                            },
                        })}
                        placeholder={t("menu.account.form.field.email.placeholder")}
                        className="w-full rounded border border-[#ffffff22] bg-transparent p-2 focus:outline-none focus:border-white"
                    />
                    {errors.email && (
                        <span className="text-red-400 text-sm">{errors.email.message}</span>
                    )}
                </div>

                <div>
                    <label className="block mb-2">
                        {t("menu.account.form.field.password.label")}
                    </label>
                    <input
                        type="password"
                        {...register("password", {
                            minLength: {
                                value: 6,
                                message: "Минимум 6 символов",
                            },
                        })}
                        placeholder={t("menu.account.form.field.password.placeholder")}
                        className="w-full rounded border border-[#ffffff22] bg-transparent p-2 focus:outline-none focus:border-white"
                    />
                    {errors.password && (
                        <span className="text-red-400 text-sm">{errors.password.message}</span>
                    )}
                </div>

                <div>
                    <label className="block mb-2">
                        {t("menu.account.form.field.number.label")}
                    </label>
                    <input
                        type="text"
                        {...register("number", {
                            required: user?.number ? "Введите номер" : false,
                            pattern: {
                                value: /^[0-9+()\s-]{7,20}$/,
                                message: "Неверный формат номера",
                            },
                        })}
                        placeholder={t("menu.account.form.field.number.placeholder")}
                        className="w-full rounded border border-[#ffffff22] bg-transparent p-2 focus:outline-none focus:border-white"
                    />
                    {errors.number && (
                        <span className="text-red-400 text-sm">{errors.number.message}</span>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-background/70 hover:bg-background rounded text-white disabled:opacity-50"
                >
                    {isLoading ? t("menu.account.form.loading") : t("menu.account.form.submit")}
                </button>

                {error && (
                    <div className="text-red-400 text-sm">
                        Ошибка: {(error as any).data?.message}
                    </div>
                )}
            </form>
        </div>
    );
};
