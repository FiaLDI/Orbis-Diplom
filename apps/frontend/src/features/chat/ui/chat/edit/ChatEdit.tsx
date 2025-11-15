import React, { useEffect } from "react";
import { CloseButton, HeadComponent, ModalLayout } from "@/shared";
import { ChatEditFormProps } from "./interface";
import { FormInput, SubmitButton, FormError } from "@/shared/ui/Form";
import { ChatEditFormData } from "./interface";
import { useChatEditModel } from "@/features/chat/hooks/model/useChatEditModel";

export const ChatEditForm: React.FC<ChatEditFormProps> = ({
  initialData,
  onClose,
  onSave,
  t,
  editQuery,
  activeServerId,
  issueId,
}) => {
  const { onSubmit, isLoadingUpdate, errorUpdate, form } = useChatEditModel(
    initialData,
    editQuery,
    onClose,
    onSave,
    activeServerId,
    issueId,
  );

  const { register, handleSubmit, reset, formState } = form;
  const { errors } = formState;

  useEffect(() => {
    if (initialData) reset({ name: initialData.name ?? "" });
  }, [initialData, reset]);

  return (
    <ModalLayout open={!!initialData} onClose={onClose}>
      <div className="p-0 w-[400px] text-white">
        <div className="bg-background w-full rounded flex items-center justify-between p-5">
          <HeadComponent title={t ? t("chat.edit.title") : ""} />

          <CloseButton handler={onClose} />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full p-5 flex flex-col gap-5"
          autoComplete="off"
        >
          <FormInput<ChatEditFormData>
            name="name"
            label={t ? t("chat.edit.form.chatname") : ""}
            placeholder={t ? t("chat.edit.form.chatname") : ""}
            register={register}
            validation={{ required: t ? t("chat.edit.form.required") : "" }}
            error={errors.name}
          />

          <div className="flex gap-2">
            <button
              type="button"
              className="flex-1 bg-background/70 text-white py-2 rounded hover:bg-background"
              onClick={onClose}
            >
              {t ? t("chat.edit.form.cancel") : ""}
            </button>

            <SubmitButton
              label={t ? t("chat.edit.form.submit") : ""}
              loading={isLoadingUpdate}
              className="flex-1"
            />
          </div>

          <FormError message={(errorUpdate as any)?.data?.message} />
        </form>
      </div>
    </ModalLayout>
  );
};
