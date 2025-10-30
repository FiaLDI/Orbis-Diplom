import globals from "globals";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import prettierPlugin from "eslint-plugin-prettier";

/** @type {import("eslint").Linter.FlatConfigArray} */
export default [
    {
        ignores: ["node_modules", "build", "dist", "**/*.config.js", "**/*.config.mjs"],
    },
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: { jsx: true },
            },
            globals: globals.browser,
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
            react: reactPlugin,
            prettier: prettierPlugin,
        },
        rules: {
            // --- Базовые JS правила ---
            ...js.configs.recommended.rules,

            // --- TypeScript ---
            ...tsPlugin.configs.recommended.rules,
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

            // --- React ---
            ...reactPlugin.configs.recommended.rules,
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "react/display-name": "warn",

            // --- Prettier как главный форматтер ---
            "prettier/prettier": [
                "error",
                {
                    tabWidth: 4,
                    singleQuote: false,
                    semi: true,
                    trailingComma: "es5",
                    printWidth: 100,
                    endOfLine: "auto",
                },
            ],
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
];
