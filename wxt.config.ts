import { defineConfig } from "wxt";

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
});
