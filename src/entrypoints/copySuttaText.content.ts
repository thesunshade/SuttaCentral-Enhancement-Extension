import isInputFocused from "./functions/isInputFocused";
import showToastNotification from "./functions/showToastNotification";
import onlyPressed from "./functions/onlyPressed";

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    // Check the setting before running the script
    chrome.storage.sync.get("copyWholeText", data => {
      const isEnabled = data["copyWholeText"] === "true"; // Convert to boolean

      if (!isEnabled) {
        console.info("❌ Copy whole text is disabled");
        return; // Exit if the setting is not enabled
      }

      console.info("⌨️ 'c' to copy text of sutta is active");
      document.addEventListener("keydown", (event: KeyboardEvent) => {
        // Check if the 'c' key is pressed
        if (onlyPressed(event, "c") && !isInputFocused()) {
          // Select the <main> element
          const mainElement = document.querySelector("article");

          // Get the inner text
          if (!mainElement) {
            console.warn("No main element found in the document.");
            return null;
          }
          let innerText = mainElement.innerText;
          innerText = innerText.replace(/⏱️.+?\)\n\n/, "");
          // Log the inner text to the console

          navigator.clipboard
            .writeText(innerText)
            .then(() => {
              showToastNotification("Sutta text copied to clipboard!");
            })
            .catch(err => {
              console.error("Failed to copy: ", err);
            });
        }
      });
    });
  },
});
