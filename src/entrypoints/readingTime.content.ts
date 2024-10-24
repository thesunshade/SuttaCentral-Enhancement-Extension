// Adds reading time to texts

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    let badge: HTMLElement | null;
    let lastProcessedContent = "";
    let currentWPM = 200;
    let isProcessing = false;
    let isInitialized = false;

    const updateReadingTime = (WPM: number, forceUpdate = false) => {
      if (isProcessing) {
        return;
      }
      isProcessing = true;

      const article = document.querySelector("article");
      if (!article) {
        isProcessing = false;
        return;
      }

      const text = article.textContent?.trim() || "";
      if (!text) {
        console.log("exiting because article is still empty");
        isProcessing = false;
        return;
      }

      // Check if content has changed or if we're forcing an update
      if (text === lastProcessedContent && !forceUpdate) {
        isProcessing = false;
        return;
      }

      lastProcessedContent = text;
      console.log("start count");

      const wordMatchRegExp = /[^\s]+/g;
      const words = text.matchAll(wordMatchRegExp);
      const wordCount = [...words].length;
      const readingTime = Math.round(wordCount / WPM);
      console.log("reading time", readingTime);

      // Create or update the badge
      if (!badge) {
        badge = document.createElement("p");
        badge.classList.add("color-secondary-text", "type--caption", "reading-time-badge");
      }

      const heading = article.querySelector("h1");
      const date = article.querySelector("time")?.parentNode;
      const targetElement = (date as HTMLElement | null) ?? (heading as HTMLElement | null);

      if (targetElement) {
        targetElement.insertAdjacentElement("afterend", badge);
      }

      badge.textContent = `⏱️ ${readingTime} min read (${WPM} wpm)`;
      isProcessing = false;
      isInitialized = true;
    };

    const checkSettings = (forceUpdate = false) => {
      console.log("check settings");
      chrome.storage.sync.get(["showReadingTime", "wordsPerMinute"], data => {
        const isEnabled = data["showReadingTime"] === "true";
        const WPM = Number(data["wordsPerMinute"]) || 200;

        if (isEnabled) {
          currentWPM = WPM;
          updateReadingTime(WPM, forceUpdate);
        } else if (badge) {
          badge.remove();
          badge = null;
        }
      });
    };

    interface StorageChanges {
      showReadingTime?: string;
      wordsPerMinute?: string;
    }

    const handleStorageChanges = (changes: StorageChanges) => {
      if (changes.showReadingTime || changes.wordsPerMinute) {
        checkSettings(true);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChanges);

    // Function to attempt initial setup multiple times if needed
    const attemptInitialSetup = () => {
      const article = document.querySelector("article");
      if (article && !isInitialized) {
        checkSettings(true);
      }
    };

    const observeDOMChanges = () => {
      let debounceTimeout: NodeJS.Timeout;

      const observer = new MutationObserver(mutations => {
        // Always attempt initial setup when DOM changes
        attemptInitialSetup();

        // Only proceed with update if already initialized
        if (!isInitialized) return;

        // Clear any existing timeout
        clearTimeout(debounceTimeout);

        // Set a new timeout
        debounceTimeout = setTimeout(() => {
          const hasRelevantChanges = mutations.some(mutation => mutation.type === "childList" && (mutation.target as Element).closest("article"));

          if (hasRelevantChanges) {
            checkSettings();
          }
        }, 1000); // Increased debounce time to 1 second
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      return () => {
        observer.disconnect();
        clearTimeout(debounceTimeout);
      };
    };

    // Initial attempts at setup
    const initialSetupInterval = setInterval(() => {
      if (isInitialized) {
        clearInterval(initialSetupInterval);
        return;
      }
      attemptInitialSetup();
    }, 100);

    // Cleanup interval after 5 seconds
    setTimeout(() => clearInterval(initialSetupInterval), 5000);

    // Start observing DOM changes immediately
    observeDOMChanges();
  },
});
