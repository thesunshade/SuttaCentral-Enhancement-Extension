import { defineConfig } from "wxt";
import removeConsole from "vite-plugin-remove-console";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  manifest: {
    name: "SuttaCentral Enhancement Extension",
    permissions: ["clipboardWrite", "contextMenus", "tabs", "storage"],
    omnibox: { keyword: "sc" },
  },
  zip: {
    name: "SC-Enhancement",
  },
  vite: configEnv => ({
    plugins: [configEnv.mode === "production" && removeConsole({ includes: ["log"] })],
  }),
});
