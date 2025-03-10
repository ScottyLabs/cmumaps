import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  build: {
    outDir: "dist",
    lib: {
      entry: resolve(__dirname, "index.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "express",
        "cors",
        "socket.io",
        "@clerk/express",
        "@prisma/client",
        /^@prisma\/client\/.*$/,
      ],
    },
    sourcemap: true,
  },
  plugins: [
    ...VitePluginNode({
      adapter: "express",
      appPath: "./index.ts",
      exportName: "app",
      tsCompiler: "esbuild",
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
    },
  },
});
