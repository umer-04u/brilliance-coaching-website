import next from "@next/eslint-plugin-next";
import react from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@next/next": next,
      react: react,
      "react-hooks": hooks,
      "@typescript-eslint": typescript,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: true,
      },
    },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs["core-web-vitals"].rules,
      ...hooks.configs.recommended.rules,

      // Is rule ko error se badal kar 'off' (band) kar diya gaya hai
      "prefer-const": "off",
      // Any type ke error ko bhi ignore kar rahe hain
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
