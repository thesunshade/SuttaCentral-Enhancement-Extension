export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    function showHeadingIds() {
      // console.info("👁️ IDs displayed for headers if main refs turned on");
      const styleTag = document.createElement("style");
      styleTag.id = "display-heading-ids";
      styleTag.textContent = `
        header .reference, h2 .reference, h3 .reference, h4 .reference, h5 .reference, h6 .reference{
          display:inline!important
        }
        `;
      document.head.appendChild(styleTag);
    }

    function removeHeadingIds() {
      // console.info("👁️ IDs displayed for headers if main refs turned on");
      const styleTag = document.getElementById("display-heading-ids");
      if (styleTag) {
        styleTag.remove();
      }
    }

    // Initial application
    chrome.storage.sync.get("viewHeadingIds", result => {
      const shouldApply = result.viewHeadingIds || "false";
      if (shouldApply == "true") {
        showHeadingIds();
      }
    });

    // Listen for changes in the viewHeadingIds setting
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === "sync" && changes.viewHeadingIds) {
        if (changes.viewHeadingIds.newValue == "true") {
          showHeadingIds();
        } else {
          removeHeadingIds();
        }
      }
    });

    // end of content script
  },
});
