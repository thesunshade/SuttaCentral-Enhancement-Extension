export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    // Check the setting before running the script
    chrome.storage.sync.get(["showReadingTime", "wordsPerMinute"], data => {
      const isEnabled = data["showReadingTime"] === "true"; // Convert to boolean
      const WPM = Number(data["wordsPerMinute"]) || 200; // Use numeric value or default to 200

      if (!isEnabled) {
        console.info("❌ Reading time display is disabled");
        return; // Exit if the setting is not enabled
      }

      insertReadingTime();

      function insertReadingTime() {
        console.info("⏱️ Reading time displayed");

        const runScript = () => {
          const observer = new MutationObserver((mutations, observer) => {
            const article = document.querySelector("article");
            if (article) {
              observer.disconnect(); // Stop observing once the article tag is found

              const contentObserver = new MutationObserver((mutations, contentObserver) => {
                const text = article.textContent;
                if (!text) return;
                if (text.trim()) {
                  contentObserver.disconnect(); // Stop observing when content is available

                  // Check if the badge already exists
                  if (!article.querySelector(".reading-time-badge")) {
                    const wordMatchRegExp = /[^\s]+/g; // Regular expression
                    const words = text.matchAll(wordMatchRegExp);
                    const wordCount = [...words].length;
                    const readingTime = Math.round(wordCount / WPM);
                    const badge = document.createElement("p");
                    badge.classList.add("color-secondary-text", "type--caption", "reading-time-badge");
                    badge.textContent = `⏱️ ${readingTime} min read (${WPM} wpm)`;

                    const heading = article.querySelector("h1");
                    const date = article.querySelector("time")?.parentNode;

                    ((date as HTMLElement | null) ?? (heading as HTMLElement)).insertAdjacentElement("afterend", badge);
                  } else {
                    // console.log("Reading time badge already exists.");
                  }
                }
              });

              // Start observing for content changes in the article
              contentObserver.observe(article, { childList: true, subtree: true });
            }
          });

          // Start observing the document for when the article element appears
          observer.observe(document, { childList: true, subtree: true });
        };

        // Helper function to monitor URL changes
        const monitorUrlChanges = (callback: () => void) => {
          let lastUrl = window.location.href;

          new MutationObserver(() => {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
              lastUrl = currentUrl;
              callback(); // Run script when URL changes
            }
          }).observe(document, { subtree: true, childList: true });
        };

        // Handle URL and state changes in an SPA
        const observeNavigation = () => {
          runScript(); // Run script on initial load

          // Capture SPA routing changes
          window.addEventListener("popstate", runScript);
          window.addEventListener("hashchange", runScript);

          // Monitor URL changes in case pushState/replaceState are not directly used
          monitorUrlChanges(runScript);
        };

        // Initialize the navigation observer
        observeNavigation();
      }
    });
  },
});
