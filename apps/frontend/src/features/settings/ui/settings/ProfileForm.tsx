import React from "react";
import { SettingsLayout } from "../../ui/layout/SettingsLayout";
import { UserData } from "@/features/auth";

import {
  FormInput,
  FormSelect,
  FormTextArea,
  SubmitButton,
  FormError,
} from "@/shared/ui/Form";
import { AvatarUpload } from "@/shared/ui/Upload/AvatarUpload";
import { ProfileFormData } from "../../types";
import { useProfileFormModel } from "../../hooks";

export const ProfileForm: React.FC<{ user: UserData["info"] }> = ({ user }) => {
  const {
    form,
    onSubmit,
    handleAvatarChange,
    t,
    updateState: { isLoading, error },
    upload,
  } = useProfileFormModel(user);

  const { register, handleSubmit, formState, watch } = form;
  const { errors } = formState;

  return (
    <SettingsLayout>
      <form
        className="flex flex-col gap-5 w-full max-w-xl"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <h2 className="text-xl font-semibold mb-2">
          {t("menu.profile.title")}
        </h2>

        {/* Avatar upload */}
        <AvatarUpload
          avatarUrl={watch("avatar_url") || user?.avatar_url || "/img/icon.png"}
          label={t("menu.profile.form.field.avatar.label")}
          onSelect={handleAvatarChange}
          progress={upload.overallProgress}
          loading={upload.loading}
        />

        {/* First name */}
        <FormInput<ProfileFormData>
          name="first_name"
          type="text"
          label={t("menu.profile.form.field.firstname.label")}
          placeholder={t("menu.profile.form.field.firstname.placeholder")}
          register={register}
          error={errors.first_name}
        />

        {/* Last name */}
        <FormInput<ProfileFormData>
          name="last_name"
          type="text"
          label={t("menu.profile.form.field.secondname.label")}
          placeholder={t("menu.profile.form.field.secondname.placeholder")}
          register={register}
          error={errors.last_name}
        />

        {/* Birth date */}
        <FormInput<ProfileFormData>
          name="birth_date"
          type="date"
          label={t("menu.profile.form.field.date.label")}
          register={register}
          error={errors.birth_date}
        />

        {/* Gender */}

        <FormSelect<ProfileFormData>
          name="gender"
          label={t("menu.profile.form.field.gender.label")}
          value={watch("gender")}
          setValue={form.setValue}
          error={errors.gender}
          options={[
            { value: "", label: t("menu.profile.form.field.gender.select") },
            {
              value: "male",
              label: t("menu.profile.form.field.gender.option.1"),
            },
            {
              value: "female",
              label: t("menu.profile.form.field.gender.option.2"),
            },
            {
              value: "other",
              label: t("menu.profile.form.field.gender.option.3"),
            },
          ]}
        />

        {/* Location */}
        <FormInput<ProfileFormData>
          name="location"
          type="text"
          label={t("menu.profile.form.field.location.label")}
          placeholder={t("menu.profile.form.field.location.placeholder")}
          register={register}
          error={errors.location}
        />

        {/* About me */}
        <FormTextArea<ProfileFormData>
          name="about"
          label={t("menu.profile.form.field.aboutme.label")}
          placeholder={t("menu.profile.form.field.aboutme.placeholder")}
          register={register}
          error={errors.about}
        />

        <SubmitButton
          label={
            isLoading
              ? t("menu.profile.form.loading")
              : t("menu.profile.form.submit")
          }
          loading={isLoading}
        />

        <FormError message={(error as any)?.data?.message} />
      </form>
    </SettingsLayout>
  );
};
