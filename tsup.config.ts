import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node24",
  outDir: "dist",
  clean: true,
  dts: false,
  splitting: false,
  shims: false,
  treeshake: true,
  external: ["dotenv"],
});
