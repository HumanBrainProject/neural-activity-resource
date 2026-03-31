import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/dev-userinfo": {
        target: "https://iam.ebrains.eu",
        changeOrigin: true,
        rewrite: () =>
          "/auth/realms/hbp/protocol/openid-connect/userinfo",
      },
    },
  },
  build: {
    target: "esnext",
  },
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "v8", // or "istanbul"
    },
    setupFiles: ["./__tests__/setup.js"],
    server: {
      deps: {
        // Force Vite to process these packages so CJS/ESM interop is handled
        // correctly in jsdom. Without this, react-plotly.js resolves as a plain
        // object instead of a component, crashing any test that renders a Visualizer.
        inline: ["neural-activity-visualizer-react", "react-plotly.js"],
      },
    },
  },
});
