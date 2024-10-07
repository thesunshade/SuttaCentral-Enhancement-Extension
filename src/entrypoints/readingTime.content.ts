export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    let badge: HTMLElement | null; // Reference to the reading time badge
    let lastProcessedContent = ""; // Store the last processed content to avoid unnecessary updates
    let currentWPM = 200; // Store the current WPM

    // console.log("Content script initialized");

    // Function to update or insert the reading time badge
    const updateReadingTime = (WPM: number, forceUpdate = false) => {
      // console.log("Updating reading time");
      const article = document.querySelector("article");
      if (!article) {
        // console.log("No article found");
        return; // Exit if no article found
      }

      const text = article.textContent?.trim() || "";
      if (!text) {
        // console.log("Article is empty");
        return; // Exit if the article is still empty
      }

      // Check if content has changed or if we're forcing an update
      if (text === lastProcessedContent && !forceUpdate) {
        // console.log("Content unchanged, skipping update");
        return;
      }
      lastProcessedContent = text;

      const wordMatchRegExp = /[^\s]+/g;
      const words = text.matchAll(wordMatchRegExp);
      const wordCount = [...words].length;
      const readingTime = Math.round(wordCount / WPM);

      // console.log(`Word count: ${wordCount}, Reading time: ${readingTime} minutes, WPM: ${WPM}`);

      // Create or update the badge
      if (!badge) {
        badge = document.createElement("p");
        badge.classList.add("color-secondary-text", "type--caption", "reading-time-badge");
      }

      const heading = article.querySelector("h1");
      const date = article.querySelector("time")?.parentNode;
      ((date as HTMLElement | null) ?? (heading as HTMLElement)).insertAdjacentElement("afterend", badge);

      badge.textContent = `⏱️ ${readingTime} min read (${WPM} wpm)`;
    };

    // Function to check and update the reading time display based on settings
    const checkSettings = (forceUpdate = false) => {
      // console.log("Checking settings");
      chrome.storage.sync.get(["showReadingTime", "wordsPerMinute"], data => {
        const isEnabled = data["showReadingTime"] === "true";
        const WPM = Number(data["wordsPerMinute"]) || 200;

        // console.log(`Settings: showReadingTime=${isEnabled}, WPM=${WPM}`);

        if (isEnabled) {
          currentWPM = WPM; // Update the current WPM
          updateReadingTime(WPM, forceUpdate); // Show the reading time if enabled
        } else if (badge) {
          // console.log("Removing reading time badge");
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
      // console.log("Storage changes detected", changes);
      if (changes.showReadingTime || changes.wordsPerMinute) {
        checkSettings(true); // Force update when settings change
      }
    };

    // Observe storage changes
    chrome.storage.onChanged.addListener(handleStorageChanges);

    // Function to observe DOM changes
    const observeDOMChanges = () => {
      // console.log("Setting up DOM observer");
      const observer = new MutationObserver(mutations => {
        for (let mutation of mutations) {
          if (mutation.type === "childList") {
            // console.log("Significant DOM change detected");
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

    // console.log("Setup complete");
  },
});
