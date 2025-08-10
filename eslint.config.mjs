import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import importPlugin from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: { import: importPlugin },
    rules: {
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          pathGroups: [
            {
              pattern: "./**/*.tsx",
              group: "sibling",
              position: "before",
            },
            {
              pattern: "**/*.module.scss",
              group: "type",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin", "external"],
          alphabetize: { order: "asc", caseInsensitive: true },
          "newlines-between": "never",
        },
      ],
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
      "object-curly-spacing": ["error", "always"],
      "react/jsx-max-props-per-line": [
        "error",
        { maximum: 1, when: "multiline" },
      ],
      "react/jsx-first-prop-new-line": ["error", "multiline-multiprop"],
      "react/jsx-closing-bracket-location": ["error", "tag-aligned"],
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];

export default eslintConfig;
