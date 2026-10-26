import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
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
});
