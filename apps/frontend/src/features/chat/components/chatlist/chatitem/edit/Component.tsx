import React, { useEffect } from "react";
import { ModalLayout } from "@/shared";
import { useUpdateChatMutation } from "@/features/chat";
import { ChatEditFormProps } from "./interface";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormInput, SubmitButton, FormError } from "@/shared/ui/Form";
import { ChatEditFormData } from "./interface";

export const ChatEditForm: React.FC<ChatEditFormProps> = ({
  initialData,
  onClose,
  onSave,
  editQuery,
  activeServerId,
  issueId,
}) => {
  const { t } = useTranslation("chat");
  const [updateChat, { isLoading, error }] = useUpdateChatMutation();

  const form = useForm<ChatEditFormData>({
    defaultValues: {
      name: initialData?.name ?? "",
    },
  });

  const { register, handleSubmit, reset, formState } = form;
  const { errors } = formState;

  useEffect(() => {
    if (initialData) reset({ name: initialData.name ?? "" });
  }, [initialData, reset]);

  // ✅ Сохранение
  const onSubmit: SubmitHandler<ChatEditFormData> = async (data) => {
    if (!data.name.trim()) return;

    try {
      if (editQuery) {
        if (!activeServerId || !issueId) return;
        editQuery({
          serverId: activeServerId,
          issueId,
          chatId: initialData.id,
          data,
        });
        onSave?.();
        return;
      }

      await updateChat({
        id: initialData.id,
        data,
      }).unwrap();

      onSave?.();
    } catch (err) {
      console.error("Failed to update chat:", err);
    } finally {
      onClose();
    }
  };

  return (
    <ModalLayout open={!!initialData} onClose={onClose}>
      <div className="p-0 w-[400px] text-white">
        <div className="bg-background w-full rounded flex items-center justify-between p-5">
          <div className="font-semibold">{t("chat.edit.title")}</div>
          <button className="cursor-pointer p-0 w-fit" onClick={onClose}>
            <X />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full p-5 flex flex-col gap-5"
          autoComplete="off"
        >
          {/* Поле ввода */}
          <FormInput<ChatEditFormData>
            name="name"
            label={t("chat.edit.form.chatname")}
            placeholder={t("chat.edit.form.chatname")}
            register={register}
            validation={{ required: t("chat.edit.form.required") }}
            error={errors.name}
          />

          {/* Кнопки */}
          <div className="flex gap-2">
            <button
              type="button"
              className="flex-1 bg-background/70 text-white py-2 rounded hover:bg-background"
              onClick={onClose}
            >
              {t("chat.edit.form.cancel")}
            </button>

            <SubmitButton
              label={t("chat.edit.form.submit")}
              loading={isLoading}
              className="flex-1"
            />
          </div>

          <FormError message={(error as any)?.data?.message} />
        </form>
      </div>
    </ModalLayout>
  );
};
