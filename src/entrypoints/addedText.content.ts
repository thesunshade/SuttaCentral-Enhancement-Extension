export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    function applyAddedTextBrackets(shouldApply: string) {
      console.info(`[ ] added text brackets: ${shouldApply === "true" ? "applied" : "removed"}`);

      const existingStyle = document.getElementById("added-text-brackets");
      if (existingStyle) {
        existingStyle.remove();
      }

      if (shouldApply === "true") {
        const styleTag = document.createElement("style");
        styleTag.id = "added-text-brackets";

        styleTag.textContent = `
          .add:before {
            content: "[";
          }
          .add:after {
            content: "]";
          }`;
        document.head.appendChild(styleTag);
      }
    }

    // Initial application
    chrome.storage.sync.get("addedTextBrackets", result => {
      const shouldApply = result.addedTextBrackets || "false";
      applyAddedTextBrackets(shouldApply);
    });

    // Listen for changes in the addedTextBrackets setting
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === "sync" && changes.addedTextBrackets) {
        applyAddedTextBrackets(changes.addedTextBrackets.newValue || "false");
      }
    });
  },
});
