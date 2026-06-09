import globals from "globals";
import jsConfig from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import prettier from "eslint-plugin-prettier";
import tsEslintPlugin from "@typescript-eslint/eslint-plugin"; 
import stylisticJs from '@stylistic/eslint-plugin-js'

/** @type {import('eslint').Linter.FlatConfigArray} */
export default [
  {
    ignores: ["node_modules/", "build/", "**/*.config.js", "**/*.config.mjs"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    rules: jsConfig.configs.recommended.rules,
  },
  {
    rules: tsPlugin.configs.recommended.rules,
  },
  {
    rules: reactPlugin.configs.recommended.rules,
  },
  {
    plugins: {
      prettier,
      "@typescript-eslint": tsEslintPlugin,
      react: reactPlugin,
      '@stylistic/js': stylisticJs
    },
    rules: {
      
      '@stylistic/js/indent': 'off',
      '@stylistic/js/max-len': ['error', {
        "code": 100,
        "tabWidth": 4
      }],
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "react/prop-types": "off",
      "react/display-name": "warn",
      "prettier/prettier": [
        "error",
        {
          tabWidth: 4,
          useTabs: false,
          printWidth: 100
        }
      ] , 
        
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
