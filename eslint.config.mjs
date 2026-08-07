import { FlatCompat } from "@eslint/eslintrc";
const compat = new FlatCompat({ baseDirectory: import.meta.dirname });
const config = [{ ignores: [".agents/**", ".next/**", "node_modules/**", "playwright-report/**", "next-env.d.ts"] }, ...compat.extends("next/core-web-vitals", "next/typescript")];
export default config;
