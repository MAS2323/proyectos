import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["react-qr-reader"], // Genial para QR en abacerías
  },
  server: {
    port: 5173,
    proxy: {
      "/auth": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
        // ¡Sin rewrite! Vite lo pasa directo como /auth/otp → backend/auth/otp
      },
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
