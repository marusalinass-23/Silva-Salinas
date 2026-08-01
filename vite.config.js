import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// base: "./" usa rutas relativas para que funcione en GitHub Pages
// sin importar el nombre del repositorio.
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon-192-v2.png", "icon-512-v2.png"],
      manifest: {
        name: "Gastos - Casa Silva Salinas",
        short_name: "Gastos",
        description: "Gastos y pendientes de la casa",
        lang: "es",
        theme_color: "#FAFAF8",
        background_color: "#FAFAF8",
        display: "standalone",
        start_url: "./",
        scope: "./",
        icons: [
          { src: "icon-192-v2.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512-v2.png", sizes: "512x512", type: "image/png" },
          { src: "icon-512-v2.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico}"]
      }
    })
  ]
});
