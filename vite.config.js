import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    // Las llamadas a /api se redirigen al servidor Express (carpeta /server)
    proxy: {
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
    },
    hmr: {
      port: 3000,
    },
  },
});
