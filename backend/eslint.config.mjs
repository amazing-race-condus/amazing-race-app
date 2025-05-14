import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,

  { ignores: ["node_modules", "eslint.config.mjs", "dist", "prisma"] },

  {
    rules: {
      quotes: ["error", "double"],
      indent: ["error", 2],
      eqeqeq: ["error"],
      "no-trailing-spaces": ["error"],
      "no-duplicate-imports": ["error"],
      "eol-last": ["error", "always"],
      "no-var": ["error"],
      "prefer-const": ["error"],
    }
  }
]);
