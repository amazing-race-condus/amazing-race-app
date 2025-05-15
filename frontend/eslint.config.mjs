import js from '@eslint/js';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactNative from 'eslint-plugin-react-native';
import jest from 'eslint-plugin-jest';
import expoConfig from 'eslint-config-expo/flat.js';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  js.configs.recommended,

  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },

      // globals: {
      // ...jest.environments.globals,
      // },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      react,
      'react-native': reactNative,
      jest
    },
    rules: {
      // Disable outdated JSX rule (not needed in React 17+)
      indent: ["error", 2],
      semi: ["error", "never"],
      eqeqeq: ['error'],
      'no-trailing-spaces': ['error'],
      'no-duplicate-imports': ['error'],
      'no-multiple-empty-lines': ['error', { 'max': 1 }],
      'no-var': ['error'],
      'prefer-const': ['error'],
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  expoConfig,

  {
    ignores: ['node_modules', 'dist', 'build'],
  },
]);