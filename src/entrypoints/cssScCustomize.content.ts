// Allows the user to insert custom css into the main site

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    console.info("🖌️ custom SC css");

    function updateCustomStyle(cssText: string) {
      let styleTag = document.getElementById("custom-sc-css") as HTMLStyleElement;
      if (!cssText) {
        // Remove the style tag if the CSS text is empty
        if (styleTag) {
          styleTag.remove();
        }
        return;
      }

      // Create the style tag if it doesn't exist
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = "custom-sc-css";
        document.head.appendChild(styleTag);
      }

      // Update the CSS text
      styleTag.textContent = cssText;
    }

    chrome.storage.sync.get("customScCss", data => {
      updateCustomStyle(data.customScCss || "");
    });

    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === "sync" && changes.customScCss) {
        const newCss = changes.customScCss.newValue || "";
        updateCustomStyle(newCss);
      }
    });
  },
});
