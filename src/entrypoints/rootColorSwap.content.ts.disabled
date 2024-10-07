export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    function applyRootColorSwap(shouldApply: string) {
      console.log(`🎨 Root color swap: ${shouldApply === "true" ? "applied" : "removed"}`);

      const existingStyle = document.getElementById("color-swap");
      if (existingStyle) {
        existingStyle.remove();
      }

      if (shouldApply === "true") {
        const styleTag = document.createElement("style");
        styleTag.id = "color-swap";

        styleTag.textContent = `
          .root .text {
            color: black!important;
          }
          .translation {
            color: lightgray!important;
          }`;
        document.head.appendChild(styleTag);
      }
    }

    // Initial application
    chrome.storage.sync.get("rootColorSwap", result => {
      const shouldApply = result.rootColorSwap || "false";
      applyRootColorSwap(shouldApply);
    });

    // Listen for changes in the rootColorSwap setting
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === "sync" && changes.rootColorSwap) {
        applyRootColorSwap(changes.rootColorSwap.newValue || "false");
      }
    });
  },
});
