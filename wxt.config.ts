import { defineConfig } from "wxt";
import removeConsole from "vite-plugin-remove-console";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: "SuttaCentral Enhancement Extension",
    permissions: ["clipboardWrite", "contextMenus", "tabs"],
    omnibox: { keyword: "sc" },
  },
  zip: {
    name: "SC-Enhancement",
  },
  // vite: () => ({
  //   plugins: [removeConsole({ includes: ["log"] })],
  // }),
});
