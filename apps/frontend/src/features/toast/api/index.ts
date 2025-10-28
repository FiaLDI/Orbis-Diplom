import { Middleware } from "@reduxjs/toolkit";
import { addToast } from "@/features/toast/slice";

export const toastMiddleware: Middleware = (store) => (next) => (action) => {
  // Ошибки
  if (action.type.endsWith("/executeMutation/rejected")) {
    const meta = action.meta?.arg;
    if (!meta) return next(action);

    const message =
      (action.payload as any)?.data?.message ||
      action.error?.message ||
      "Ошибка при выполнении операции.";

    store.dispatch(addToast(`Ошибка (${meta.endpointName}): ${message}`, "error"));
  }

  // Успешные мутации
  if (
    action.type.endsWith("/executeMutation/fulfilled") &&
    action.meta?.arg?.type === "mutation"
  ) {
    const { endpointName } = action.meta.arg;
    const successMessages: Record<string, string> = {
      CreateSever: "Сервер успешно создан",
      CreateChat: "Чат успешно создан",
      DeleteChat: "Чат удалён",
      JoinServer: "Вы присоединились к серверу",
      UpdateRolePermissions: "Права успешно обновлены",
      CreateRole: "Роль успешно создана",
      UpdateServerRole: "Роль обновлена",
      deleteRole: "Роль удалена",
      AssignRoleToMember: "Роль назначена пользователю",
      RemoveRoleFromMember: "Роль снята с пользователя",
    };

    const message =
      successMessages[endpointName] || `Операция ${endpointName} выполнена успешно.`;
    store.dispatch(addToast(message, "success"));
  }

  return next(action);
};
