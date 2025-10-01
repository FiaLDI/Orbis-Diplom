// Реэкспорт всего публичного API модуля auth
export * from "./userSettingsSlice";
export * from "./api/userApi";
export * from "./types/user";

// Компоненты
export { default as AccountSettings } from "./components/Settings/AccountSettings";
export { default as AppearanceSettings } from "./components/Settings/AppearanceSettings";
export { default as LanguageSettings } from "./components/Settings/LanguageSettings";
export { default as NotificationSettings } from "./components/Settings/NotificationSettings";
export { default as ProfileSettings } from "./components/Settings/ProfileSettings";
// Хуки
// export { useAuth } from './hooks/useAuth';
// export { useUserSession } from './hooks/useUserSession';

// Утилиты (по необходимости)
// export { validateEmail } from './utils/authHelpers';
