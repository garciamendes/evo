import { readFileSync } from "node:fs";
import type { NextConfig } from "next";

// The code editor loads Monaco from public/monaco/<version>/ (see scripts/copy-monaco.mjs).
const monacoVersion: string = JSON.parse(readFileSync("node_modules/monaco-editor/package.json", "utf8")).version;

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_MONACO_VERSION: monacoVersion },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
