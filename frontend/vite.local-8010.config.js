import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const backendPort = process.env.TEST_BASIC_BACKEND_PORT || "8010";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    proxy: {
      "/api": {
        target: `http://127.0.0.1:${backendPort}`,
        changeOrigin: true,
      },
    },
  },
});
