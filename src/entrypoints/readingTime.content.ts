export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    let badge: HTMLElement | null; // Reference to the reading time badge
    let lastProcessedContent = ""; // Store the last processed content to avoid unnecessary updates
    let currentWPM = 200; // Store the current WPM

    // Function to update or insert the reading time badge
    const updateReadingTime = (WPM: number, forceUpdate = false) => {
      const article = document.querySelector("article");
      if (!article) {
        return; // Exit if no article found
      }

      const text = article.textContent?.trim() || "";
      if (!text) {
        return; // Exit if the article is still empty
      }

      // Check if content has changed or if we're forcing an update
      if (text === lastProcessedContent && !forceUpdate) {
        return;
      }
      lastProcessedContent = text;

      const wordMatchRegExp = /[^\s]+/g;
      const words = text.matchAll(wordMatchRegExp);
      const wordCount = [...words].length;
      const readingTime = Math.round(wordCount / WPM);

      // Create or update the badge
      if (!badge) {
        badge = document.createElement("p");
        badge.classList.add("color-secondary-text", "type--caption", "reading-time-badge");
      }

      const heading = article.querySelector("h1");
      const date = article.querySelector("time")?.parentNode;

      // Ensure at least one element exists before proceeding
      const targetElement = (date as HTMLElement | null) ?? (heading as HTMLElement | null);

      if (targetElement) {
        targetElement.insertAdjacentElement("afterend", badge);
      } else {
        // console.error("Both heading and date elements are null.");
      }

      badge.textContent = `⏱️ ${readingTime} min read (${WPM} wpm)`;
    };

    // Function to check and update the reading time display based on settings
    const checkSettings = (forceUpdate = false) => {
      chrome.storage.sync.get(["showReadingTime", "wordsPerMinute"], data => {
        const isEnabled = data["showReadingTime"] === "true";
        const WPM = Number(data["wordsPerMinute"]) || 200;

        if (isEnabled) {
          currentWPM = WPM; // Update the current WPM
          updateReadingTime(WPM, forceUpdate); // Show the reading time if enabled
        } else if (badge) {
          badge.remove();
          badge = null;
        }
      });
    };

    // Function to handle changes in storage settings
    // Define an interface for the changes object
    interface StorageChanges {
      showReadingTime?: string;
      wordsPerMinute?: string;
    }
    const handleStorageChanges = (changes: StorageChanges) => {
      if (changes.showReadingTime || changes.wordsPerMinute) {
        checkSettings(true); // Force update when settings change
      }
    };

    // Observe storage changes
    chrome.storage.onChanged.addListener(handleStorageChanges);

    // Function to observe DOM changes
    const observeDOMChanges = () => {
      const observer = new MutationObserver(mutations => {
        for (let mutation of mutations) {
          if (mutation.type === "childList") {
            checkSettings(); // Re-check settings and update reading time
            break; // Only need to do this once per batch of mutations
          }
        }
      });

      // Observe the entire document body for changes
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    };

    // Initial setup
    checkSettings();
    observeDOMChanges();
  },
});
