import React, { useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { uploadFiles } from "@/features/upload";
import { useUpdateProfileMutation } from "../..";
import { FormData } from "./interface";
import { useTranslation } from "react-i18next";

export const Component: React.FC = () => {
    const user = useAppSelector((s) => s.auth.user?.info);
    const dispatch = useAppDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { t } = useTranslation("settings");
    const [updateProfile, { isLoading, error }] = useUpdateProfileMutation();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            first_name: user?.first_name || "",
            last_name: user?.last_name || "",
            birth_date: user?.birth_date
                ? new Date(user.birth_date).toISOString().split("T")[0]
                : "",
            gender: user?.gender || "",
            location: user?.location || "",
            about: user?.about || "",
            avatar_url: user?.avatar_url || "",
        },
    });

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length) return;

        const result = await dispatch(uploadFiles(Array.from(files))).unwrap();
        const url = result[0];
        setValue("avatar_url", url, { shouldValidate: true });
    };

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        if (!user?.id) return;
        try {
            await updateProfile({ id: user.id, data }).unwrap();
        } catch (err) {
            console.error("Profile update error:", err);
        }
    };

    return (
        <div className="flex flex-col gap-4 p-5 bg-foreground/30 w-full text-white">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="flex gap-3 items-center">
                    <img
                        src={user?.avatar_url || "/default-avatar.png"}
                        alt="avatar"
                        className="w-20 h-20 rounded-full object-cover"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1 bg-background/70 hover:bg-background text-white rounded"
                    >
                        {t("menu.profile.form.field.avatar.label")}
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        className="hidden"
                    />
                </div>
                <div>
                    <label className="block mb-2">
                        {t("menu.profile.form.field.firstname.label")}
                    </label>
                    <input
                        type="text"
                        placeholder={t("menu.profile.form.field.firstname.placeholder")}
                        {...register("first_name", {
                            maxLength: { value: 100, message: "Не более 100 символов" },
                        })}
                        className="p-2 border rounded bg-transparent w-full"
                    />
                    {errors.first_name && (
                        <span className="text-red-400 text-sm">{errors.first_name.message}</span>
                    )}
                </div>
                <div>
                    <label className="block mb-2">
                        {t("menu.profile.form.field.secondname.label")}
                    </label>
                    <input
                        type="text"
                        placeholder={t("menu.profile.form.field.secondname.placeholder")}
                        {...register("last_name", {
                            maxLength: { value: 100, message: "Не более 100 символов" },
                        })}
                        className="p-2 border rounded bg-transparent w-full"
                    />
                    {errors.last_name && (
                        <span className="text-red-400 text-sm">{errors.last_name.message}</span>
                    )}
                </div>
                <div>
                    <label className="block mb-2">{t("menu.profile.form.field.date.label")}</label>
                    <input
                        type="date"
                        {...register("birth_date")}
                        className="p-2 border rounded bg-transparent w-full"
                    />
                </div>
                <div>
                    <label className="block mb-2">
                        {t("menu.profile.form.field.gender.label")}
                    </label>
                    <select
                        {...register("gender")}
                        className="p-2 border rounded bg-transparent w-full"
                    >
                        <option value="">{t("menu.profile.form.field.gender.select")}</option>
                        <option value="male">{t("menu.profile.form.field.gender.option.1")}</option>
                        <option value="female">
                            {t("menu.profile.form.field.gender.option.2")}
                        </option>
                        <option value="other">
                            {t("menu.profile.form.field.gender.option.3")}
                        </option>
                    </select>
                </div>
                <div>
                    <label className="block mb-2">
                        {t("menu.profile.form.field.location.label")}
                    </label>
                    <input
                        type="text"
                        placeholder={t("menu.profile.form.field.location.placeholder")}
                        {...register("location", {
                            maxLength: { value: 100, message: "Не более 100 символов" },
                        })}
                        className="p-2 border rounded bg-transparent w-full"
                    />
                    {errors.location && (
                        <span className="text-red-400 text-sm">{errors.location.message}</span>
                    )}
                </div>
                <div>
                    <label className="block mb-2">
                        {t("menu.profile.form.field.aboutme.label")}
                    </label>
                    <textarea
                        placeholder={t("menu.profile.form.field.aboutme.placeholder")}
                        {...register("about", {
                            maxLength: { value: 300, message: "Не более 300 символов" },
                        })}
                        className="p-2 border rounded bg-transparent h-28 resize-none w-full"
                    />
                    {errors.about && (
                        <span className="text-red-400 text-sm">{errors.about.message}</span>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-3 py-2 bg-background/70 hover:bg-background text-white rounded disabled:opacity-50"
                >
                    {isLoading ? t("menu.profile.form.loading") : t("menu.profile.form.submit")}
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
