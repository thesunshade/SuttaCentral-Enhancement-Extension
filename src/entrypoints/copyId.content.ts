// Clicking segment id copies the link to the clipboard

import showToastNotification from "./functions/showToastNotification";

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    // Check the setting before running the script
    chrome.storage.sync.get("clickSegmentNumbersToCopyUrl", data => {
      const isEnabled = data["clickSegmentNumbersToCopyUrl"] === "true"; // Convert to boolean

      if (!isEnabled) {
        return; // Exit if the setting is not enabled
      }

      activateClickToCopy();
    });

    // Listen for changes to clickSegmentNumbersToCopyUrl setting in the extension
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === "sync") {
        if (changes.clickSegmentNumbersToCopyUrl.newValue === "true") {
          activateClickToCopy();
        } else if (changes.clickSegmentNumbersToCopyUrl.newValue === "false") {
          deactivateClickToCopy();
        }
      }
    });

    // Define the event handler separately so it can be added and removed
    function handleClickToCopy(event: MouseEvent) {
      const target = event.target as HTMLElement;

      // Check if the clicked element is an `a` element within a `.reference` element
      if (target.tagName === "A" && target.closest(".reference")) {
        // Get the ID of the clicked anchor
        const anchorId = (target as HTMLAnchorElement).getAttribute("href");

        // Copy the updated URL to the clipboard after the default navigation occurs
        setTimeout(() => {
          navigator.clipboard
            .writeText(window.location.href)
            .then(() => {
              showToastNotification("URL with segment number copied to clipboard.");
            })
            .catch(err => {
              console.error("Failed to copy URL:", err);
            });
        }, 10); // Use setTimeout to wait for the default action to complete
      }
    }

    // Function to activate the click-to-copy feature
    function activateClickToCopy() {
      document.addEventListener("click", handleClickToCopy);
    }

    // Function to deactivate the click-to-copy feature
    function deactivateClickToCopy() {
      document.removeEventListener("click", handleClickToCopy);
    }
  },
});
