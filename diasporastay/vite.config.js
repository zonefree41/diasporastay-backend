import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,        // ✅ always use this port
    strictPort: true,  // stop Vite from switching ports
  },
});
