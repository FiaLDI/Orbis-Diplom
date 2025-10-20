export const defaultNS = "translation";

export const resources = {
  en: {
    translation: {
      hello: "Hello, {{name}}!",
      menu: {
        settings: "Settings",
        profile: "Profile",
      },
    },
  },
  ru: {
    translation: {
      hello: "Привет, {{name}}!",
      menu: {
        settings: "Настройки",
        profile: "Профиль",
      },
    },
  },
} as const;
