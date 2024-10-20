// This allows user to copy the link to the current page without any parameters

import isInputFocused from "./functions/isInputFocused";
import showToastNotification from "./functions/showToastNotification";
import onlyPressed from "./functions/onlyPressed";

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    // Check the setting before running the script
    chrome.storage.sync.get("copyBareLink", data => {
      const isEnabled = data["copyBareLink"] === "true"; // Convert to boolean

      if (!isEnabled) {
        console.info("❌ Copy bare link is disabled");
        return; // Exit if the setting is not enabled
      }

      console.info("⌨️ 'u' to copy bare url is active");
      document.addEventListener("keydown", (event: KeyboardEvent) => {
        if (onlyPressed(event, "u") && !isInputFocused()) {
          const url = window.location.href.split("?")[0];

          navigator.clipboard
            .writeText(url)
            .then(() => {
              showToastNotification("Url copied to clipboard!");
            })
            .catch(err => {
              console.error("Failed to copy: ", err);
            });
        }
      });
    });
  },
});
