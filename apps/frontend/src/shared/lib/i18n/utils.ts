export const loadLocales = () => {
    const modules = import.meta.glob("@/features/**/locales/*.json", { eager: true });
    const resources: Record<string, Record<string, any>> = {};

    for (const path in modules) {
        const match = path.match(/features\/([^/]+)\/locales\/([a-z]{2})\.json$/);
        if (!match) continue;

        const [, featureName, lang] = match;
        const namespace = featureName;

        if (!resources[lang]) resources[lang] = {};
        resources[lang][namespace] = (modules[path] as any).default;
    }

    return resources;
};
