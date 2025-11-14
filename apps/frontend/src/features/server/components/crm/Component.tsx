import React from "react";
import { CloseButton, HeadComponent, ModalLayout } from "@/shared";
import { CreateServerFormData, JoinServerFormData } from "@/features/server";
import { CirclePlus } from "lucide-react";
import { FormInput, SubmitButton, FormError } from "@/shared/ui/Form";
import { useCrmServerModel } from "../../model/useCrmServerModel";

export const ServerModal: React.FC = () => {
    const { open, t, onCreate, onJoin, setOpen, createForm, joinForm, createState, joinState } =
        useCrmServerModel();

    return (
        <>
            <button onClick={() => setOpen(true)} className="cursor-pointer">
                <CirclePlus
                    color="#fff"
                    strokeWidth={1.25}
                    className="w-8 h-8 transition-transform hover:scale-110"
                />
            </button>

            <ModalLayout open={open} onClose={() => setOpen(false)}>
                <div className="p-0 text-white flex flex-col w-[500px]">
                    <div className="bg-background w-full rounded flex items-center justify-between p-0">
                        <HeadComponent title={t("form.title")} />
                        <CloseButton handler={() => setOpen(false)} />
                    </div>

                    <div className="w-full flex flex-col p-5 gap-8">
                        <form
                            onSubmit={createForm.handleSubmit(onCreate)}
                            className="flex gap-5 items-end w-full"
                        >
                            <FormInput<CreateServerFormData>
                                name="name"
                                type="text"
                                label={t("form.createplaceholder")}
                                placeholder={t("form.createplaceholder")}
                                register={createForm.register}
                                validation={{
                                    required: t("form.required"),
                                    minLength: { value: 6, message: t("form.minlength") },
                                }}
                                error={createForm.formState.errors.name}
                            />
                            <SubmitButton
                                label={t("form.create")}
                                loading={createState.isLoading}
                                className="min-w-[130px]"
                            />
                        </form>

                        {/* 🔵 Подключение к серверу */}
                        <form
                            onSubmit={joinForm.handleSubmit(onJoin)}
                            className="flex gap-5 items-end w-full"
                        >
                            <FormInput<JoinServerFormData>
                                name="serverId"
                                type="text"
                                label={t("form.connectplaceholder")}
                                placeholder={t("form.connectplaceholder")}
                                register={joinForm.register}
                                validation={{ required: t("form.required") }}
                                error={joinForm.formState.errors.serverId}
                            />
                            <SubmitButton
                                label={t("form.connect")}
                                loading={joinState.isLoading}
                                className="min-w-[130px]"
                            />
                        </form>

                        {/* Ошибки */}
                        <FormError
                            message={
                                (createState.error as any)?.data?.message ||
                                (joinState.error as any)?.data?.message
                            }
                        />
                    </div>
                </div>
            </ModalLayout>
        </>
    );
};
