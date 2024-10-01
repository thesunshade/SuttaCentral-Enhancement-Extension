import { ids } from "./random.content/ids.js";

export default defineContentScript({
  matches: ["*://suttacentral.net/?lang=en"],
  main() {
    console.info("💥 random sutta is active");

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
            const existingRandomItem = ulElement?.querySelector("li.random-item");
            if (!existingRandomItem && ulElement) {
              insertRandomItem(ulElement); // Call the function to insert the item
            }
          }
        }
      }
    }

    // MutationObserver to watch for changes in the document
    function observeDomChanges() {
      const observer = new MutationObserver(() => {
        findNavInShadowDOM();
      });

      observer.observe(document, { childList: true, subtree: true });
    }

    // Start observing when the page loads
    document.addEventListener("DOMContentLoaded", () => {
      observeDomChanges();
      findNavInShadowDOM(); // Initial search
    });
  },
});
