import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  define: {
    "process.env.API_URL": JSON.stringify(
      process.env.API_URL || "https://klusteri-website-back-matlury-test.apps.ocp-prod-0.k8s.it.helsinki.fi",
    ),
    "process.env.SITE_KEY": JSON.stringify(
      process.env.SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI", // reCAPTCHA site key, uses the testing key from Google if not set
    ),
  },
});
