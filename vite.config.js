import { defineConfig } from "vite";

// base "./" faz o build funcionar em qualquer caminho (Railway, GitHub Pages, arquivo local).
export default defineConfig({
  base: "./",
  build: { outDir: "dist", sourcemap: true },
});
