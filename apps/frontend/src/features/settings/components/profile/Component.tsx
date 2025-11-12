import React from "react";
import { useProfileFormModel } from "../../model/useProfileFormModel";
import { FormInput } from "../../ui/field/FormInput";
import { FormSelect } from "../../ui/field/FormSelect";
import { FormTextArea } from "../../ui/field/FormTextArea";
import { AvatarUpload } from "@/shared/ui/Upload/AvatarUpload";
import { SettingsLayout } from "../../ui/layout/SettingsLayout";
import { UserData } from "@/features/auth";

export const Component: React.FC<{ user: UserData["info"] }> = ({ user }) => {
    const {
        form,
        onSubmit,
        handleAvatarChange,
        t,
        updateState: { isLoading, error },
        upload,
    } = useProfileFormModel(user);

    const { register, handleSubmit, formState } = form;
    const { errors } = formState;

    return (
        <SettingsLayout>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                <AvatarUpload
                    avatarUrl={form.watch("avatar_url") || user?.avatar_url || "/img/icon.png"}
                    label={t("menu.profile.form.field.avatar.label")}
                    onSelect={handleAvatarChange}
                    progress={upload.overallProgress}
                    loading={upload.loading}
                />

                <FormInput
                    label={t("menu.profile.form.field.firstname.label")}
                    placeholder={t("menu.profile.form.field.firstname.placeholder")}
                    register={register("first_name")}
                    error={errors.first_name?.message}
                />

                <FormInput
                    label={t("menu.profile.form.field.secondname.label")}
                    placeholder={t("menu.profile.form.field.secondname.placeholder")}
                    register={register("last_name")}
                    error={errors.last_name?.message}
                />

                <FormInput
                    label={t("menu.profile.form.field.date.label")}
                    type="date"
                    register={register("birth_date")}
                />

                <FormSelect
                    label={t("menu.profile.form.field.gender.label")}
                    register={register("gender")}
                >
                    <option value="">{t("menu.profile.form.field.gender.select")}</option>
                    <option value="male">{t("menu.profile.form.field.gender.option.1")}</option>
                    <option value="female">{t("menu.profile.form.field.gender.option.2")}</option>
                    <option value="other">{t("menu.profile.form.field.gender.option.3")}</option>
                </FormSelect>

                <FormInput
                    label={t("menu.profile.form.field.location.label")}
                    placeholder={t("menu.profile.form.field.location.placeholder")}
                    register={register("location")}
                    error={errors.location?.message}
                />

                <FormTextArea
                    label={t("menu.profile.form.field.aboutme.label")}
                    placeholder={t("menu.profile.form.field.aboutme.placeholder")}
                    register={register("about")}
                    error={errors.about?.message}
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-3 py-2 bg-background/70 hover:bg-background text-white rounded disabled:opacity-50"
                >
                    {isLoading ? t("menu.profile.form.loading") : t("menu.profile.form.submit")}
                </button>

                {error && (
                    <div className="text-red-400 text-sm">{(error as any).data?.message}</div>
                )}
            </form>
        </SettingsLayout>
    );
};
