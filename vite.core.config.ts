import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    {
      name: "vedana-core-entry",
      configureServer(server) {
        server.middlewares.use((request, _response, next) => {
          if (request.url === "/" || request.url?.startsWith("/vedana-core")) {
            request.url = "/core.html";
          }
          next();
        });
      },
    },
    react(),
    tailwindcss(),
  ],
  root: path.resolve(import.meta.dirname, "client"),
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "client", "src") },
  },
  server: { host: true, open: "/vedana-core" },
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/core"),
    emptyOutDir: true,
    rollupOptions: {
      input: { index: path.resolve(import.meta.dirname, "client", "core.html") },
    },
  },
});
