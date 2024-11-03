// This allows the user to change the root text (e.g. Pāli) or translation text color
/// to any valid color value

import validateCSSColor from "./functions/validateCSSColor";

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    // Apply styles for a given setting and selector
    function createAndAddStyleTag(setting: string, selector: string): void {
      let styleTag = document.querySelector(`#${setting}Style`);
      if (styleTag) {
        styleTag.remove();
      }

      chrome.storage.sync.get([setting], result => {
        const color = result[setting] || "";
        const validColor = validateCSSColor(color);

        if (validColor) {
          styleTag = document.createElement("style");
          styleTag.id = `${setting}Style`;
          styleTag.textContent = `${selector} { color: ${validColor} !important; }`;
          document.head.appendChild(styleTag);
        }
      });
    }

    // Function to handle multiple settings and selectors
    function applyStylesForOverrides(overrides: { setting: string; selector: string }[]): void {
      overrides.forEach(override => {
        createAndAddStyleTag(override.setting, override.selector);
      });
    }

    // Listen for changes in storage and update corresponding styles
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === "sync") {
        for (const setting in changes) {
          const change = changes[setting];
          if (change && change.newValue) {
            const override = cssOverrides.find(o => o.setting === setting);
            if (override) {
              createAndAddStyleTag(setting, override.selector);
            }
          }
        }
      }
    });

    // Example list of settings and their corresponding selectors
    const cssOverrides = [
      { setting: "rootColor", selector: ".root .text, .root" },
      { setting: "translationColor", selector: ".translation" },
    ];

    // Initial application of styles
    applyStylesForOverrides(cssOverrides);
  },
});
