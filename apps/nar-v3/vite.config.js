import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      // Vite 8 / rolldown's CJS→ESM interop calls __toESM with isNodeMode=1,
      // which ignores the __esModule flag and wraps the whole exports object as
      // the default export. react-plotly.js sets exports.__esModule=true and
      // exports.default=PlotComponent, but isNodeMode=1 causes Plot to resolve
      // to {__esModule: true, default: PlotComponent} instead of PlotComponent.
      //
      // Fix: exclude neural-activity-visualizer-react from pre-bundling so Vite
      // serves its ESM source directly (triggering this transform), then rewrite
      // the import to extract .default explicitly before rolldown sees it.
      name: "fix-react-plotly-interop",
      enforce: "pre",
      transform(code, id) {
        if (
          id.includes("neural-activity-visualizer-react") &&
          code.includes('import Plot from "react-plotly.js"')
        ) {
          return {
            code: code.replace(
              'import Plot from "react-plotly.js"',
              'import _reactPlotly from "react-plotly.js";\nconst Plot = _reactPlotly.default ?? _reactPlotly;'
            ),
            map: null,
          };
        }
      },
    },
  ],
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
  optimizeDeps: {
    // Pre-bundle react-plotly.js so its CJS is converted to ESM before the
    // browser sees it. neural-activity-visualizer-react is excluded so Vite
    // serves it as raw ESM, which triggers the fix-react-plotly-interop plugin
    // transform above (plugin transforms don't run on pre-bundled files).
    include: ["react-plotly.js"],
    exclude: ["neural-activity-visualizer-react"],
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
