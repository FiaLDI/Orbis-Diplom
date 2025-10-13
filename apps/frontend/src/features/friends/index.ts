// Реэкспорт всего публичного API модуля auth
export * from "./slice";
export * from "./api";
export * from "./types";

// Компоненты
export { default as FriendList } from "./components/FriendList";
export { default as SearchFriends } from "./components/SearchFriends";

// Хуки
// export { useAuth } from './hooks/useAuth';
// export { useUserSession } from './hooks/useUserSession';

// Утилиты (по необходимости)
// export { validateEmail } from './utils/authHelpers';
