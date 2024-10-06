import { ids } from "./random.content/ids.js";

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    // Check the randomLink setting and return if it's not enabled
    function isRandomLinkEnabled(callback) {
      chrome.storage.sync.get(["randomLink"], result => {
        console.log("Current value of randomLink in storage:", result.randomLink); // Log the retrieved value
        if (result.randomLink === "true") {
          callback();
        } else {
          console.info("💥 random sutta feature is disabled");
        }
      });
    }

    // Function to run the main functionality of the script
    function runRandomSuttaFeature() {
      console.info("💥 random sutta is active, popu");

      // Recursive function to search for an element inside shadow DOMs
      function searchElementRecursively(selector: string, root: Document | ShadowRoot): Element | null {
        const element = root.querySelector(selector);
        if (element) return element;

        const shadowHosts = root.querySelectorAll("*");
        for (const host of shadowHosts) {
          if ((host as HTMLElement).shadowRoot) {
            const found = searchElementRecursively(selector, (host as HTMLElement).shadowRoot!);
            if (found) return found;
          }
        }

        return null;
      }

      // Function to create link to random sutta
      function randomSuttaUrl() {
        const idList = Object.values(ids).flat();
        const randomNumber = Math.floor(Math.random() * idList.length);
        const randomId = idList[randomNumber];
        return `https://suttacentral.net/${randomId}/en/sujato`;
      }

      // Function to create and insert a new list item
      function insertRandomItem(ulElement: HTMLUListElement) {
        const newRandomSuttaUrl = randomSuttaUrl();
        const liElement = document.createElement("li");
        liElement.classList.add("random-item");
        liElement.innerHTML = `<a href="${newRandomSuttaUrl}">Random Sutta</a>`;
        // Remove the existing random item if it exists to ensure we are always creating a fresh one
        const existingRandomItem = ulElement.querySelector("li.random-item");
        if (existingRandomItem) {
          existingRandomItem.remove();
        }
        ulElement.appendChild(liElement);
      }

      // Function to find the <nav> inside the shadow DOM
      function findNavInShadowDOM() {
        const shadowHost = searchElementRecursively("#static_pages_nav_menu", document);

        if (shadowHost) {
          const shadowRoot = (shadowHost as HTMLElement).shadowRoot;
          if (shadowRoot) {
            const navElement = searchElementRecursively("nav", shadowRoot);
            if (navElement) {
              const ulElement = navElement.querySelector("ul");
              if (ulElement) {
                insertRandomItem(ulElement); // Call the function to insert or update the item
              }
            }
          }
        }
      }

      // Function to observe DOM changes
      function observeDomChanges() {
        const observer = new MutationObserver(() => {
          findNavInShadowDOM();
        });

        observer.observe(document, { childList: true, subtree: true });
      }

      // Listen for history changes (pushState, popState)
      function observeHistoryChanges() {
        // Re-run the script whenever the history state changes
        window.addEventListener("popstate", findNavInShadowDOM);
        const originalPushState = history.pushState;
        history.pushState = function (...args) {
          originalPushState.apply(this, args);
          findNavInShadowDOM();
        };
      }

      // Start observing when the page loads
      document.addEventListener("DOMContentLoaded", () => {
        observeDomChanges();
        observeHistoryChanges(); // Observe history changes
        findNavInShadowDOM(); // Initial search
      });
    }

    // Check if the randomLink setting is enabled
    isRandomLinkEnabled(runRandomSuttaFeature);

    // Listen for changes in storage
    chrome.storage.onChanged.addListener(changes => {
      if (changes.randomLink) {
        isRandomLinkEnabled(runRandomSuttaFeature); // Re-check and run when the setting changes
      }
    });
  },
});
