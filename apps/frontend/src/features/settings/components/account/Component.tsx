import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAppSelector } from "@/app/hooks";
import { useUpdateAccountMutation } from "@/features/settings";

interface AccountFormData {
  username: string;
  email: string;
  password: string;
  number: string;
}

export const Component: React.FC = () => {
  const user = useAppSelector((s) => s.auth.user?.info);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountFormData>({
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      password: "",
      number: user?.number || "",
    },
  });

  const [updateAccount, { isLoading, error }] = useUpdateAccountMutation();

  const onSubmit: SubmitHandler<AccountFormData> = async (data) => {
    try {
      if (!user?.id) return;

      // если поле пустое → не отправляем его на бэк
      const cleaned = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== "")
      );

      await updateAccount({ id: Number(user.id), data: cleaned }).unwrap();
    } catch (err) {
      console.error("Update account error:", err);
    }
  };

  return (
    <div className="p-10 bg-[#04122f80] text-white rounded-lg">
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        className="flex flex-col gap-8"
      >
        <h1 className="text-4xl lg:text-2xl text-center">
          Настройки аккаунта
        </h1>

        {/* Username */}
        <div>
          <label className="block mb-2">Имя пользователя</label>
          <input
            type="text"
            {...register("username", { required: "Введите имя" })}
            className="w-full rounded border border-[#ffffff22] bg-transparent p-2 focus:outline-none focus:border-white"
          />
          {errors.username && (
            <span className="text-red-400 text-sm">
              {errors.username.message}
            </span>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2">Email</label>
          <input
            type="email"
            {...register("email", {
              required: user?.email ? "Введите email" : false,
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Неверный формат email",
              },
            })}
            className="w-full rounded border border-[#ffffff22] bg-transparent p-2 focus:outline-none focus:border-white"
          />
          {errors.email && (
            <span className="text-red-400 text-sm">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block mb-2">Пароль</label>
          <input
            type="password"
            {...register("password", {
              minLength: {
                value: 6,
                message: "Минимум 6 символов",
              },
            })}
            placeholder="Введите новый пароль"
            className="w-full rounded border border-[#ffffff22] bg-transparent p-2 focus:outline-none focus:border-white"
          />
          {errors.password && (
            <span className="text-red-400 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Number */}
        <div>
          <label className="block mb-2">Номер телефона</label>
          <input
            type="text"
            {...register("number", {
              required: user?.number ? "Введите номер" : false,
              pattern: {
                value: /^[0-9+()\s-]{7,20}$/,
                message: "Неверный формат номера",
              },
            })}
            placeholder="Введите телефон"
            className="w-full rounded border border-[#ffffff22] bg-transparent p-2 focus:outline-none focus:border-white"
          />
          {errors.number && (
            <span className="text-red-400 text-sm">
              {errors.number.message}
            </span>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white disabled:opacity-50"
        >
          {isLoading ? "Сохраняем..." : "Сохранить изменения"}
        </button>

        {/* Error */}
        {error && (
          <div className="text-red-400 text-sm">
            Ошибка: {(error as any).data?.message}
          </div>
        )}
      </form>
    </div>
  );
};
