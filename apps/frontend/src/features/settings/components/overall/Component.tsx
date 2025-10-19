import { useAppSelector } from "@/app/hooks";
import React from "react";
import { ModalLayout } from "@/shared";
import { SettingsButton } from "../../ui/Button";

export const Component: React.FC<{ open?: boolean; onClose?: () => void }> = ({
  open,
  onClose,
}) => {
  const user = useAppSelector((s) => s.auth.user?.info);
  const settings = useAppSelector((s) => s.settings);

  return (
    <ModalLayout open={open} onClose={onClose}>
      <div className="w-full h-full flex flex-col justify-between items-center text-white">
        {/* Верхняя часть — контент */}
        <div className="flex-grow w-full overflow-y-auto px-6 py-4 space-y-6">
          {/* === ПРОФИЛЬ === */}
          <section>
            <h2 className="text-center text-xl font-semibold mb-2">
              Настройки профиля
            </h2>

            {settings.profileInfoUpdated?.avatar_url ? (
              <div className="flex flex-col items-center gap-2 mb-4">
                <div className="flex gap-3 items-center">
                  <img
                    src={user?.avatar_url || "/default-avatar.png"}
                    alt="Текущий аватар"
                    className="w-14 h-14 rounded-full object-cover border border-white/30"
                  />
                  <img
                    src={settings.profileInfoUpdated.avatar_url}
                    alt="Новый аватар"
                    className="w-14 h-14 rounded-full object-cover border border-green-400"
                  />
                </div>
                <p className="text-sm opacity-70">Аватар обновлён</p>
              </div>
            ) : null}

            {settings.profileInfoUpdated?.about ? (
              <div className="text-center">
                <p className="opacity-70 text-sm mb-1">О себе:</p>
                <p className="font-medium">
                  {user?.displayName || "—"} → {settings.profileInfoUpdated.about}
                </p>
              </div>
            ) : null}
          </section>

          {/* === АККАУНТ === */}
          {settings.accountInfoUpdated &&
          Object.keys(settings.accountInfoUpdated).length ? (
            <section>
              <h2 className="text-center text-xl font-semibold mb-2">
                Настройки аккаунта
              </h2>

              {settings.accountInfoUpdated?.username && (
                <div className="flex justify-between border-b border-white/20 py-1">
                  <span>Имя пользователя:</span>
                  <span>
                    {user?.username} →{" "}
                    <strong>{settings.accountInfoUpdated.username}</strong>
                  </span>
                </div>
              )}

              {settings.accountInfoUpdated?.email && (
                <div className="flex justify-between border-b border-white/20 py-1">
                  <span>Email:</span>
                  <span>
                    {user?.email} →{" "}
                    <strong>{settings.accountInfoUpdated.email}</strong>
                  </span>
                </div>
              )}

              {settings.accountInfoUpdated?.number && (
                <div className="flex justify-between border-b border-white/20 py-1">
                  <span>Телефон:</span>
                  <span>
                    {user?.id} →{" "}
                    <strong>{settings.accountInfoUpdated.number}</strong>
                  </span>
                </div>
              )}
            </section>
          ) : null}
        </div>

        {/* Нижняя часть — кнопка */}
        <div className="w-full flex justify-center py-4 border-t border-white/10">
          <SettingsButton handler={() => onClose?.()} disabled={false}>
            Подтвердить
          </SettingsButton>
        </div>
      </div>
    </ModalLayout>
  );
};
