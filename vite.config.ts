import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      open: false,
      filename: "dist/stats.html",
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      "@": "/src",
      "@api": "/src/api",
      "@components": "/src/components",
      "@domains": "/src/domains",
      "@hooks": "/src/hooks",
      "@stores": "/src/stores",
      "@assets": "/src/assets",
    },
  },
});
