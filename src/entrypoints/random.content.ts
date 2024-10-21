import { ids } from "./random.content/ids.js";

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    const checkRandomLinkEnabled = (callback: () => void): void => {
      chrome.storage.sync.get(["randomLink"], ({ randomLink }) => {
        randomLink === "true" ? callback() : console.info("💥 Random Sutta feature is disabled");
      });
    };

    const generateRandomSuttaUrl = (): string => {
      const idList = Object.values(ids).flat();
      const randomId = idList[Math.floor(Math.random() * idList.length)];
      return `https://suttacentral.net/${randomId}/en/sujato`;
    };

    const createRandomSuttaLinkElement = (randomSuttaUrl: string): HTMLLIElement => {
      const liElement = document.createElement("li");
      liElement.classList.add("random-item");
      const linkElement = document.createElement("a");
      linkElement.href = randomSuttaUrl;
      linkElement.textContent = "RANDOM SUTTA";
      liElement.appendChild(linkElement);
      return liElement;
    };

    const insertRandomSuttaLink = (ulElement: HTMLUListElement) => {
      const randomSuttaUrl = generateRandomSuttaUrl();
      const existingRandomItem: HTMLAnchorElement | null = ulElement.querySelector("li.random-item a");

      existingRandomItem
        ? (existingRandomItem.href = randomSuttaUrl)
        : ulElement.appendChild(createRandomSuttaLinkElement(randomSuttaUrl));
    };

    const searchInShadowDOM = (selector: string, root: Document | ShadowRoot): Element | null => {
      const queue = [root];
      while (queue.length) {
        const currentRoot = queue.shift();
        const element = currentRoot?.querySelector(selector);
        if (element) return element;

        const shadowHosts = currentRoot?.querySelectorAll('*') || [];
        for (const host of shadowHosts) {
          if (host instanceof HTMLElement && host.shadowRoot) {
            queue.push(host.shadowRoot);
          }
        }
      }
      return null;
    };

    const handleNavigationUpdate = (): void => {
      const navHost = searchInShadowDOM("#static_pages_nav_menu", document);
      if (!navHost || !(navHost instanceof HTMLElement) || !navHost.shadowRoot) {
        return;
      }

      const navElement = searchInShadowDOM("nav", navHost.shadowRoot);
      const ulElement = navElement?.querySelector("ul") as HTMLUListElement | null;

      if (ulElement) {
        insertRandomSuttaLink(ulElement);
      }
    };

    const observeDOMChanges = () => {
      const observer = new MutationObserver(() => {
        handleNavigationUpdate();
      });

      observer.observe(document, { childList: true, subtree: true });
      window.addEventListener("beforeunload", () => observer.disconnect());
    };

    const observeHistoryChanges = () => {
      window.addEventListener("popstate", handleNavigationUpdate);

      const originalPushState = history.pushState;
      history.pushState = function (...args) {
        originalPushState.apply(this, args);
        handleNavigationUpdate();
      };
    };

    const initRandomSuttaFeature = () => {
      console.info("💥 Random Sutta feature is active");
      document.addEventListener("DOMContentLoaded", () => {
        handleNavigationUpdate();
        observeDOMChanges();
        observeHistoryChanges();
      });
    };

    chrome.storage.onChanged.addListener(changes => {
      if (changes.randomLink) {
        checkRandomLinkEnabled(initRandomSuttaFeature);
      }
    });

    checkRandomLinkEnabled(initRandomSuttaFeature);
  },
});
