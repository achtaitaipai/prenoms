import path from "node:path";

import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tanstackRouter({}), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "styled-system": path.resolve(__dirname, "../../packages/ui/styled-system"),
    },
  },
  envDir: path.resolve(__dirname, "../.."),
  server: {
    port: 3001,
  },
});
