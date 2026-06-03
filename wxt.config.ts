import { defineConfig } from "wxt";
import removeConsole from "vite-plugin-remove-console";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  manifest: {
    web_accessible_resources: [
      {
        resources: ["icon/ddFavicon.png", "icon/favicon.ico", "icon/96.png"],
        matches: ["*://discourse.suttacentral.net/*", "*://suttacentral.net/*"],
      },
    ],
    content_scripts: [
      {
        matches: ["*://suttacentral.net/*"],
        css: ["styles/content.css"],
      },
    ],
    name: "SuttaCentral Enhancement Extension",
    permissions: ["clipboardWrite", "contextMenus", "storage"],
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
    plugins: [configEnv.mode === "production" && removeConsole({ includes: ["log"] })],
  }),
  runner: {
    chromiumArgs: ["--disable-features=DisableLoadExtensionCommandLineSwitch"],
  },
});

// old
// configEnv.mode === "development" && removeConsole({ includes: ["info"] })
