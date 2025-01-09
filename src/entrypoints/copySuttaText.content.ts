// copies the text of the sutta to the clipboard

import isInputFocused from "./functions/isInputFocused";
import showToastNotification from "./functions/showToastNotification";
import onlyPressed from "./functions/onlyPressed";

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    const hideClasses = (hide: boolean) => {
      const classes = ["difficulty-container", "reading-time-badge"];
      const article = document.querySelector("article") as HTMLElement;
      const action = hide ? "add" : "remove";
      classes.forEach(className => {
        article.querySelector(`.${className}`)?.classList[action]("hide");
      });
    };

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
          hideClasses(true);
          const { innerText } = mainElement;

          navigator.clipboard
            .writeText(innerText)
            .then(() => {
              hideClasses(false) 
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
