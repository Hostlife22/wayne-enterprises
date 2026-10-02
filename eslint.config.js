import js from "@eslint/js";
import tseslint from "typescript-eslint";
import hooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default tseslint.config(
  { ignores: ["dist", "node_modules", "playwright-report", "test-results"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { "react-hooks": hooks },
    rules: hooks.configs.recommended.rules,
  },
  {
    files: ["src/configuration/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "**/scene/**",
                "**/showroom/**",
                "three",
                "@react-three/*",
              ],
              message:
                "Configuration data must not depend on rendering or showroom UI.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/scene/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/showroom/**", "**/App"],
              message:
                "The scene receives data through props; it must not import the showroom.",
            },
          ],
        },
      ],
    },
  },
);
