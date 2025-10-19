import React from "react";
import { SectionLayout } from "../../components/Layout/SectionLayout";
import { TitleSection } from "../../components/UI/TitleSection";
import { SubmitHandler, useForm } from "react-hook-form";
import { InputField, SubmitButton } from "./FormField";

interface SupportFormData {
    name: string;
    email: string;
    description: string;
}

export const Support = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SupportFormData>();

    const onSubmit: SubmitHandler<SupportFormData> = async (data) => {
        try {
            console.log(data);
        } catch (err) {
            console.error("Login error:", err);
        }
    };

    return (
        <div className="bg-[rgba(27,30,75,0.3)] " id="support">
            <SectionLayout classListContainer="gap-10 lg:max-w-7xl lg:flex-row">
                <div className="flex flex-col gap-5 w-full lg:p-5">
                    <TitleSection><p className="lg:text-left ">Остались вопросы? <br />
Мы на связи!</p></TitleSection>
                    <p className="text-lg ">
                        Здесь вы можете обратиться за помощью по любому интересующему вас вопросу — будь то настройка сервера, проблемы с аккаунтом или просто совет по использованию платформы. Наша команда и сообщество всегда готовы поддержать вас!
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    {...register}
                    className="flex w-full flex-col gap-10 items-center bg-[#2140dd2f] rounded-[20px] p-10"
                >
                    <InputField<SupportFormData>
                        type="text"
                        placeholder="Иван"
                        name="name"
                        register={register}
                        error={errors.name}
                        validation={{ required: "Required" }}
                        label="Имя"
                    />
                    <InputField<SupportFormData>
                        type="text"
                        placeholder="Ivan@example.net"
                        name="email"
                        register={register}
                        error={errors.email}
                        validation={{ required: "Required" }}
                        label="Почта"
                    />
                    <div className="flex flex-col gap-2 w-full">
                        <label className="text-lg">Описание проблемы</label>
                        <textarea
                            placeholder={"Я хочу спросить о...."}
                            className="border-2 p-2 border-white rounded-[20px] w-full box-content outline-none text-lg "
                            {...register("description", { required: "Required" })}
                        ></textarea>
                        {errors.description && <div>{errors.description.message}</div>}
                        
                    </div>

                    <SubmitButton label="Отправить" />
                </form>
            </SectionLayout>
        </div>
    );
};
