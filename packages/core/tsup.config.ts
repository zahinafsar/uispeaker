import { defineConfig } from "tsup";

export default defineConfig([
  // ESM + CJS builds (library consumers)
  {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
    sourcemap: true,
    minify: true,
    treeshake: true,
    target: "es2017",
  },
  // IIFE build (script tag / UMD-like auto-init)
  {
    entry: { uispeaker: "src/global.ts" },
    format: ["iife"],
    globalName: "UISpeaker",
    clean: false,
    sourcemap: true,
    minify: true,
    target: "es2017",
    outDir: "dist",
  },
]);
