import { defineConfig } from "wxt";
import removeConsole from "vite-plugin-remove-console";
import htmlImport from "@ayatkyo/vite-plugin-html-import";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  manifest: {
    name: "SuttaCentral Enhancement Extension",
    permissions: ["clipboardWrite", "contextMenus", "tabs", "storage", "scripting"],
    host_permissions: ["<all_urls>"],
    omnibox: { keyword: "sc" },
    browser_specific_settings: {
      gecko: {
        id: "info@readingfaithfully.org",
      },
    },
  },
  zip: {
    name: "SC-Enhancement",
  },
  vite: configEnv => ({
    plugins: [configEnv.mode === "production" && removeConsole({ includes: ["log"] }), configEnv.mode === "development" && removeConsole({ includes: ["info"] }), htmlImport()],
  }),
});
