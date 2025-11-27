// features/support/components/SupportForm.tsx
import React from "react";
import { SectionLayout } from "../../components/layout/SectionLayout";
import { TitleSection } from "../../components/section/TitleSection";

import {
  FormInput,
  FormTextArea,
  SubmitButton,
  FormError,
} from "@/shared/ui/Form";

import { useSupportFormModel } from "./useSupportFormModel";
import { appendErrors } from "react-hook-form";

export const SupportForm = () => {
  const { form, onSubmit } = useSupportFormModel();
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  return (
    <div className="bg-[rgba(27,30,75,0.3)]" id="support">
      <SectionLayout className="gap-10 lg:max-w-7xl lg:flex-row">
        
        {/* Text block */}
        <div className="flex flex-col gap-5 w-full lg:p-5">
          <TitleSection>
            <p className="lg:text-left">
              Остались вопросы? <br /> Мы на связи!
            </p>
          </TitleSection>

          <p className="text-lg opacity-90">
            Заполните форму — наша команда ответит вам в ближайшее время.
            Поддерживаем серверы, аккаунты, рабочие пространства и всё,
            что связано с Orbis.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col gap-4"
          autoComplete="off"
        >
          {/* Name */}
          <FormInput
            name="name"
            type="text"
            label="Имя"
            placeholder="Иван"
            register={register}
            error={errors.name}
            validation={{ required: "Введите имя" }}
          />

          {/* Email */}
          <FormInput
            name="email"
            type="email"
            label="Почта"
            placeholder="example@domain.net"
            register={register}
            error={errors.email}
            validation={{
              required: "Введите почту",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Неверный формат email",
              },
            }}
          />

          {/* Description */}
          <FormTextArea
            name="description"
            label="Описание проблемы"
            placeholder="Я хочу спросить о..."
            register={register}
            error={errors.description}
            validation={{ required: "Опишите проблему" }}
          />

          <SubmitButton label="Отправить" />

          <FormError message={errors.description?.message || undefined} />
        </form>

      </SectionLayout>
    </div>
  );
};
