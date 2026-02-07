import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import envCompatible from 'vite-plugin-env-compatible';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), envCompatible()],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
    proxy: {
      "/api": {
        target: "http://api:8000",
        changeOrigin: true,
      },
    },
  },
  define: {
    "process.env.VITE_API_URL": JSON.stringify(
      process.env.VITE_API_URL || "http://localhost:8000/api"
    ),
    "process.env.VITE_SITE_KEY": JSON.stringify(
      process.env.VITE_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // reCAPTCHA site key, uses the testing key from Google if not set
    ),
  },
});
