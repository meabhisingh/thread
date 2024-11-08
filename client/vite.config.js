import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    SERVER_URL: JSON.stringify("http://88.222.215.201:5000"),
  },
});
