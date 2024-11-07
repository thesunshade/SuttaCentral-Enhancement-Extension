// The easiest way to create a new theme is to open the SuttaCentral.net
// website and go into dev tools. Click on the body tag and a long list of
// css variables will appear. You can then use the color picker
// to test out different colours. navigating to new pages (without a real page refresh)
// should keep the changed colors. Be sure to test out a variety of different pages.
//
// Unfortunately it is necessary to add the `!important` flag on all the colors.
//

// If you copy from the inspector, replace
// (--.+?): (.+?);
// with
// "$1":"$2!important;",
//
// To make the theme available to users, you will need to add the exact name to the list of options in the src\entrypoints\popup\settingsConfig.ts file.

import themes from "./data/themes.json";

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    function applyTheme(selectedTheme: keyof typeof themes) {
      console.info(`🎨 Theme: ${selectedTheme}`);

      // Remove any existing theme style tag
      const existingStyle = document.getElementById("theme-style");
      if (existingStyle) {
        existingStyle.remove();
      }

      if (selectedTheme !== "none" && themes[selectedTheme]) {
        const styleTag = document.createElement("style");
        styleTag.id = "theme-style";

        const cssVariables = Object.entries(themes[selectedTheme])
          .map(([key, value]) => `${key}: ${value}!important;`)
          .join("\n");

        styleTag.textContent = `
          body {
            ${cssVariables}
          }
        `;
        document.head.appendChild(styleTag);
      }
    }

    // Initial theme application
    chrome.storage.sync.get("theme", result => {
      const theme = (result.theme as keyof typeof themes) || "none";
      applyTheme(theme);
    });

    // Listen for changes in the theme setting
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === "sync" && changes.theme) {
        applyTheme(changes.theme.newValue as keyof typeof themes);
      }
    });
  },
});
