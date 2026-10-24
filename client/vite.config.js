import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Target defaults to the remote Render API if no local proxy target is set
  const target =
    env.VITE_PROXY_TARGET ||
    "https://codealpha-ecommerce-store-1.onrender.com";

  return {
    plugins: [
      react(),
      tailwindcss({
        config: "./tailwind.config.js",
      }),
    ],
    server: {
      proxy: {
        "/api": {
          target: target,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
