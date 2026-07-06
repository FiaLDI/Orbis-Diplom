import React from "react";
import { FormInput, SubmitButton, FormError } from "@/shared/ui/Form";
import { AvatarUpload } from "@/shared/ui/Upload/AvatarUpload";

type TFn = (key: string) => string;

export const BasicSettingsSection: React.FC<{
    t: TFn;
    activeserver: { name: string; avatar_url?: string };
    form: {
        register: any;
        formState: { errors: any };
        watch: (k: string) => any;
        onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
        onPickAvatar: (e: React.ChangeEvent<HTMLInputElement>) => void;
        updateState: { isLoading: boolean; error?: unknown };
        uploadLoading: boolean;
        uploadProgress: number;
    };
}> = ({ t, activeserver, form }) => {
    const {
        register,
        formState,
        watch,
        onSubmit,
        onPickAvatar,
        updateState,
        uploadLoading,
        uploadProgress,
    } = form;
    const { errors } = formState;

    return (
        <div className="p-5 flex flex-col gap-5 border-b border-white/20">
            <h4 className="text-2xl">{t("settings.server_settings")}</h4>

            <form onSubmit={onSubmit} className="flex flex-col gap-6" autoComplete="off">
                <FormInput
                    name="name"
                    type="text"
                    label={t("settings.server_name")}
                    placeholder="Server name"
                    register={register as any}
                    validation={{ required: t("settings.server_name_required") }}
                    error={errors.name as any}
                />

                <div className="flex flex-col gap-2">
                    <label className="text-sm opacity-70">{t("settings.server_avatar")}</label>
                    <AvatarUpload
                        avatarUrl={
                            watch("avatar_url") || activeserver.avatar_url || "/img/icon.png"
                        }
                        onSelect={onPickAvatar}
                        label={t("settings.server_avatar")}
                        progress={uploadProgress}
                        loading={uploadLoading}
                    />
                </div>

                <SubmitButton
                    label={updateState.isLoading ? t("settings.saving") : t("settings.save")}
                    loading={updateState.isLoading}
                    className="w-fit"
                />
                <FormError message={(updateState as any)?.error?.data?.message} />
            </form>
        </div>
    );
};
