import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: "SuttaCentral Enhancement Extension",
    action: {
      default_title: "SuttaCentral Enhancement Extension",
    },
    permissions: ["clipboardWrite"],
    omnibox: { keyword: "sc" },
  },
});
