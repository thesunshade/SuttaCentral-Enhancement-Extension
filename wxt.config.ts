import { defineConfig } from "wxt";
import removeConsole from "vite-plugin-remove-console";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  manifest: {
    web_accessible_resources: [
      {
        resources: ["icon/ddFavicon.png", "icon/favicon.ico"],
        matches: ["*://discourse.suttacentral.net/*"],
      },
    ],
    content_scripts: [
      {
        js: ["/js/bootstrap.min.js"],
        matches: ["*://suttacentral.net/*"],
      },
    ],
    name: "SuttaCentral Enhancement Extension",
    permissions: ["clipboardWrite", "contextMenus", "activeTab", "storage", "scripting"],
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
    plugins: [configEnv.mode === "production" && removeConsole({ includes: ["log"] }), configEnv.mode === "development" && removeConsole({ includes: ["info"] })],
  }),
});
