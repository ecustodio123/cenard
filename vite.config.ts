import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import { productionIndexable } from "./src/data/seo-config.ts";

export default defineConfig(({ mode }) => ({
  define: {
    "import.meta.env.VITE_SITE_INDEXABLE": JSON.stringify(String(mode === "production" && productionIndexable({ ...loadEnv(mode, process.cwd(), ""), ...process.env }))),
  },
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "react-vendor",
              test: /node_modules\/(react|react-dom|react-router|scheduler)\//,
            },
            {
              name: "validation",
              test: /node_modules\/(zod|react-hook-form)\//,
            },
          ],
        },
      },
    },
  },
}));
