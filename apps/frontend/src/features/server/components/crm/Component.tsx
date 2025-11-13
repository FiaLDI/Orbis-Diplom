import React from "react";
import { ModalLayout } from "@/shared";
import {
    useCreateSeverMutation,
    useJoinServerMutation,
    useLazyGetServersQuery,
} from "@/features/server";
import { useTranslation } from "react-i18next";
import { CirclePlus, X } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormInput, SubmitButton, FormError } from "@/shared/ui/Form";

interface CreateServerFormData {
    name: string;
}

interface JoinServerFormData {
    serverId: string;
}

export const ServerModal: React.FC = () => {
    const { t } = useTranslation("server");
    const [open, setOpen] = React.useState(false);

    // --- API hooks
    const [createServer, createState] = useCreateSeverMutation();
    const [joinServer, joinState] = useJoinServerMutation();
    const [trigger] = useLazyGetServersQuery();

    // --- формы отдельно
    const createForm = useForm<CreateServerFormData>({
        defaultValues: { name: "" },
    });

    const joinForm = useForm<JoinServerFormData>({
        defaultValues: { serverId: "" },
    });

    // --- обновление серверов
    React.useEffect(() => {
        trigger({});
    }, [createState.isSuccess, joinState.isSuccess]);

    // --- обработчики
    const onCreate: SubmitHandler<CreateServerFormData> = async (data) => {
        if (!data.name.trim() || data.name.length < 6) return;
        try {
            await createServer({ name: data.name }).unwrap();
            createForm.reset();
            setOpen(false);
        } catch (err) {
            console.error("Failed to create server:", err);
        }
    };

    const onJoin: SubmitHandler<JoinServerFormData> = async (data) => {
        if (!data.serverId.trim()) return;
        try {
            await joinServer(data.serverId).unwrap();
            joinForm.reset();
            setOpen(false);
        } catch (err) {
            console.error("Failed to join server:", err);
        }
    };

    return (
        <>
            {/* Кнопка открытия модалки */}
            <button onClick={() => setOpen(true)} className="cursor-pointer">
                <CirclePlus
                    color="#fff"
                    strokeWidth={1.25}
                    className="w-8 h-8 transition-transform hover:scale-110"
                />
            </button>

            {/* Модалка */}
            <ModalLayout open={open} onClose={() => setOpen(false)}>
                <div className="p-0 text-white flex flex-col w-[500px]">
                    {/* Header */}
                    <div className="bg-background w-full rounded flex items-center justify-between p-5">
                        <h2 className="w-full text-2xl">{t("form.title")}</h2>
                        <button className="cursor-pointer p-0" onClick={() => setOpen(false)}>
                            <X />
                        </button>
                    </div>

                    <div className="w-full flex flex-col p-5 gap-8">
                        {/* 🟢 Создание сервера */}
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
