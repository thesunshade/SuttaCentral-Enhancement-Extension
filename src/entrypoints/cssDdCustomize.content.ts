export default defineContentScript({
  matches: ["*://discourse.suttacentral.net/*"],
  main() {
    console.info("🖌️ custom DD css");
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
        styleTag.id = "custom-dd-css";
        document.head.appendChild(styleTag);
      }

      // Update the CSS text
      styleTag.textContent = cssText;
    }

    chrome.storage.sync.get("customDdCss", data => {
      updateCustomStyle(data.customDdCss || "");
    });

    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === "sync" && changes.customDdCss) {
        const newCss = changes.customDdCss.newValue || "";
        updateCustomStyle(newCss);
      }
    });
  },
});
