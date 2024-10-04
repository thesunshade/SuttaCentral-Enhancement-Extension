export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    console.info("🔤 Language displayed");

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

    // Function to update the language display
    const updateLanguageDisplay = () => {
      try {
        const reduxState = JSON.parse(localStorage.reduxState);
        const language = reduxState.siteLanguage || "—"; // Fallback if siteLanguage is not found
        const languageFull = reduxState.fullSiteLanguageName || "Language not set";
        languageDiv.textContent = `${language.toUpperCase()}`;
        languageDiv.title = languageFull;
      } catch (error) {
        console.error("Failed to parse reduxState:", error);
      }
    };

    // Recursive function to find the button inside shadow roots
    const findButtonInShadowDOM = (node: Node): HTMLElement | null => {
      // Check if this node is the button we're looking for
      if (node instanceof HTMLElement && node.matches("md-icon-button#more-menu-button")) {
        return node as HTMLElement;
      }

      // If the node has a shadow root, traverse it
      if (node instanceof HTMLElement && node.shadowRoot) {
        const shadowElements = node.shadowRoot.childNodes;
        for (const shadowNode of shadowElements) {
          const found = findButtonInShadowDOM(shadowNode);
          if (found) return found;
        }
      }

      // Traverse child nodes
      for (const child of node.childNodes) {
        const found = findButtonInShadowDOM(child);
        if (found) return found;
      }

      return null;
    };

    // Function to insert the languageDiv after the target button
    const insertLanguageDiv = () => {
      const targetElement = findButtonInShadowDOM(document.body);
      if (targetElement) {
        // Insert the languageDiv after the targetElement
        targetElement.insertAdjacentElement("afterend", languageDiv);
      }
    };

    // Initial display
    updateLanguageDisplay();
    insertLanguageDiv();

    // Use a MutationObserver to watch for changes to localStorage
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          updateLanguageDisplay();
        }
      }
    });

    // Create a target node to observe
    const targetNode = document.body;

    // Configuration of the observer:
    const config = { childList: true, subtree: true };

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    // Also listen to storage events
    window.addEventListener("storage", event => {
      if (event.key === "reduxState") {
        updateLanguageDisplay();
      }
    });

    // Insert the div again if the button is re-rendered
    const buttonObserver = new MutationObserver(insertLanguageDiv);
    buttonObserver.observe(targetNode, config);
  },
});
