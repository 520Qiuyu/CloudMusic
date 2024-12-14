import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import monkey, { cdn, util } from "vite-plugin-monkey";
import AutoImport from "unplugin-auto-import/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    AutoImport({
      imports: [util.unimportPreset],
    }),
    monkey({
      entry: "src/main.jsx",
      userscript: {
        icon: "https://vitejs.dev/logo.svg",
        namespace: "https://github.com/520Qiuyu/CloudMusic",
        match: [
          "https://music.163.com/**/*",
        ],
        require: [
          // "https://cdn.jsdelivr.net/npm/antd@5.22.4/dist/reset.min.css",
        ],
      },
      server: {
        open: false,
      },
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
      build: {
        externalGlobals: {
          react: cdn.jsdelivr("React", "umd/react.production.min.js"),
          "react-dom": cdn.jsdelivr(
            "ReactDOM",
            "umd/react-dom.production.min.js"
          ),
          antd: cdn.jsdelivr("antd", "dist/antd.min.js"),
          "@ant-design/icons":
            cdn.jsdelivr(
              "AntDesignIcons",
              "dist/index.umd.min.js",
            ),
          "node-forge": cdn.jsdelivr("forge", "lib/index.min.js"),
        },
      },

    }),
  ],
  build: {
    sourcemap: true,
  },
});
