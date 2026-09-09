// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { server } from "./src/mocks/node";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    {
      name: "msw",
      hooks: {
        "astro:server:setup": () => server.listen(),
        "astro:server:done": () => server.close()
      }
    }
  ]
});