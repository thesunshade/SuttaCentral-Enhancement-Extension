import { defineContentScript } from "wxt/sandbox";

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    console.log("Content script initialized");

    let currentUrl = window.location.href;
    let hasRun = false;
    let isObserving = true;

    function checkAndRun() {
      const newUrl = window.location.href;
      if (newUrl !== currentUrl) {
        console.log("URL changed from", currentUrl, "to", newUrl);
        currentUrl = newUrl;
        hasRun = false;
        isObserving = true;
        observer.observe(document.body, { childList: true, subtree: true });
      }

      if (!hasRun) {
        const targetElement = document.querySelector("main#simple_text_content");
        if (targetElement) {
          console.log("Target element found, running main code");
          runMainCode();
          hasRun = true;
          isObserving = false;
          observer.disconnect();
        } else {
          console.log("Target element not found, continuing to observe");
        }
      }
    }

    function runMainCode() {
      // Check the setting before running the script
      chrome.storage.sync.get("rootOnLegacy", data => {
        const isEnabled = data["rootOnLegacy"] === "true";
        if (!isEnabled) {
          console.log("rootOnLegacy is not enabled. Skipping.");
          return;
        }
        console.log("rootOnLegacy is active, running main code");

        // Your main code here
        console.log("Main code executed for URL:", currentUrl);
        // Add your API call or other logic here
      });
    }

    // Set up a MutationObserver to watch for DOM changes
    const observer = new MutationObserver(() => {
      if (isObserving) {
        checkAndRun();
      }
    });

    // Function to handle URL changes
    function handleUrlChange() {
      checkAndRun();
    }

    // Listen for URL changes
    window.addEventListener("popstate", handleUrlChange);

    // Intercept pushState and replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    history.pushState = function () {
      originalPushState.apply(this, arguments);
      handleUrlChange();
    };
    history.replaceState = function () {
      originalReplaceState.apply(this, arguments);
      handleUrlChange();
    };

    // Initial check and observe
    checkAndRun();
  },
});
