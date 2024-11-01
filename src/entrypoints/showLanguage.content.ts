// Adds the current user's site language to the top bar

import { querySelectorDeep } from "query-selector-shadow-dom";

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    // Function to update the language display
    const updateLanguageDisplay = () => {
      try {
        const reduxState = JSON.parse(localStorage.reduxState);
        const language = reduxState.siteLanguage || "—"; // Fallback if siteLanguage is not found
        const languageFull = reduxState.fullSiteLanguageName || "Language not set";
        languageDiv.textContent = `${language.toUpperCase()}`;
        languageDiv.title = languageFull;
      } catch (error) {
        // console.error("Failed to parse reduxState:", error);
      }
    };

    // Create a div element
    const languageDiv = document.createElement("div");
    languageDiv.style.position = "fixed";
    languageDiv.style.fontSize = "10px";
    languageDiv.style.top = "1px";
    languageDiv.style.right = "1px";
    languageDiv.style.backgroundColor = "rgba(168, 164, 156, 0.8)";
    languageDiv.style.padding = "2px";
    languageDiv.style.border = "0px solid #ccc";
    languageDiv.style.borderRadius = "5px";
    languageDiv.style.cursor = "default";
    languageDiv.style.zIndex = "1000"; // Make sure it appears on top

    // Insert the languageDiv after the target button
    const insertLanguageDiv = () => {
      const targetElement = querySelectorDeep("md-icon-button#more-menu-button");
      if (targetElement) {
        // Insert the languageDiv after the targetElement
        targetElement.insertAdjacentElement("afterend", languageDiv);
      }
    };

    window.addEventListener("load", function () {
      this.setTimeout(() => {
        updateLanguageDisplay();
        insertLanguageDiv();
      }, 1000);
    });

    // Check the setting before running the script
    chrome.storage.sync.get("showUserLanguage", data => {
      const isEnabled = data["showUserLanguage"] === "true"; // Convert to boolean

      if (isEnabled) {
        console.info("🔤 Language displayed");
        // Initial display
        updateLanguageDisplay();
        insertLanguageDiv();
      } else {
        console.info("❌ Language display is disabled");
        return; // Exit if the setting is not enabled
      }

      // this listens for changes to changes to the language and re-renders the notification when it does
      const targetNode = document.getElementById("main_html_root");

      if (targetNode) {
        // Create an observer instance
        const observer = new MutationObserver(mutationsList => {
          for (const mutation of mutationsList) {
            if (mutation.type === "attributes" && mutation.attributeName === "lang") {
              updateLanguageDisplay();
            }
          }
        });

        // Configuration of the observer: watch for attribute changes
        observer.observe(targetNode, { attributes: true, attributeFilter: ["lang"] });
      }

      // Watch for changes to the setting and update the display
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === "sync" && changes.showUserLanguage) {
          const newValue = changes.showUserLanguage.newValue === "true"; // Convert to boolean
          if (newValue) {
            console.info("🔤 Language displayed");
            updateLanguageDisplay();
            insertLanguageDiv();
          } else {
            console.info("❌ Language display is disabled");
            languageDiv.remove(); // Remove the languageDiv if the setting is false
          }
        }
      });
    });
  },
});
