import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }],
      "no-console": "warn",
      "eqeqeq": ["error", "always"],
      "no-var": "error",
      "prefer-const": ["error", { destructuring: "all" }],
      "curly": ["error", "multi-line"],
      "no-throw-literal": "error",
    },
  },
  {
    ignores: ["dist/", "node_modules/", "coverage/", "examples/", "dev/", "tools/", "test-results/"],
  },
];
