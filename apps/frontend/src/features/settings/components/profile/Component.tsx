import React from "react";
import { useProfileFormModel } from "../../model/useProfileFormModel";
import { AvatarUpload } from "../../ui/upload/AvatarUpload";
import { FormInput } from "../../ui/field/FormInput";
import { FormSelect } from "../../ui/field/FormSelect";
import { FormTextArea } from "../../ui/field/FormTextArea";

export const Component = () => {
  const {
    form,
    onSubmit,
    handleAvatarChange,
    t,
    updateState: { isLoading, error },
    user,
  } = useProfileFormModel();

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  return (
    <div className="flex flex-col gap-4 p-5 bg-foreground/30 w-full text-white">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        
        <AvatarUpload
            avatarUrl={form.watch("avatar_url")}
            label={t("upload.avatar")}
            onSelect={(file) => handleAvatarChange(file)}
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

        {error && <div className="text-red-400 text-sm">{(error as any).data?.message}</div>}
      </form>
    </div>
  );
};
