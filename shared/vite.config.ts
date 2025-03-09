import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "types.ts"),
        errorCode: resolve(__dirname, "errorCode.ts"),
        "websocket-types/webSocketTypes": resolve(
          __dirname,
          "websocket-types/webSocketTypes.ts",
        ),
        "websocket-types/userTypes": resolve(
          __dirname,
          "websocket-types/userTypes.ts",
        ),
        "websocket-types/roomTypes": resolve(
          __dirname,
          "websocket-types/roomTypes.ts",
        ),
        "websocket-types/poiTypes": resolve(
          __dirname,
          "websocket-types/poiTypes.ts",
        ),
        "websocket-types/nodeTypes": resolve(
          __dirname,
          "websocket-types/nodeTypes.ts",
        ),
        "utils/floorCodeUtils": resolve(__dirname, "utils/floorCodeUtils.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: ["geojson"],
    },
  },
  plugins: [dts({ rollupTypes: true })],
});
