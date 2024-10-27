// Adds a notification of number of translations in the user's language

import { querySelectorDeep } from "query-selector-shadow-dom";

// Your existing interfaces
interface ReduxState {
  siteLanguage: string;
  suttaPublicationInfo: {
    uid: string;
    lang: string;
    authorUid: string;
  };
}

interface Translation {
  lang: string;
  author_uid: string;
}

interface SuttaplexData {
  translations: Translation[];
}

// Main function to handle the notification logic
export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    console.info("➕ show other translations active");

    let isRunning = false; // Track if the notification logic is running
    let observer: MutationObserver | null = null; // To hold the observer instance

    function startNotifications() {
      if (!isRunning) {
        isRunning = true;
        runNotifyAdditionalTranslations();
      }
    }

    function stopNotifications() {
      if (isRunning) {
        isRunning = false;
        const parallelButton = querySelectorDeep("#btnShowParallels");
        if (parallelButton) {
          const otherCount = parallelButton.querySelector(".otherCount");
          if (otherCount) {
            otherCount.remove(); // Remove the count display
          }
        }
        if (observer) {
          observer.disconnect();
          observer = null;
        }
      }
    }

    function runNotifyAdditionalTranslations() {
      let lastProcessedState: string | null = null;
      let debounceTimer: NodeJS.Timeout | null = null;

      function debounce(func: () => void, delay: number) {
        return () => {
          if (debounceTimer) clearTimeout(debounceTimer);
          debounceTimer = setTimeout(func, delay);
        };
      }

      function debouncedRunScript() {
        // Wait 500ms after last state change
        return debounce(runScript, 500);
      }

      function processStateChange() {
        const currentState = localStorage.reduxState;
        if (currentState !== lastProcessedState) {
          lastProcessedState = currentState;
          debouncedRunScript();
        }
      }

      function runScript() {
        // Check if reduxState exists in localStorage
        const reduxStateString = localStorage.getItem("reduxState");
        if (!reduxStateString) {
          // console.warn("reduxState is not available in localStorage.");
          return;
        }

        let reduxState: ReduxState;
        try {
          reduxState = JSON.parse(reduxStateString);
        } catch (error) {
          console.log("Failed to parse reduxState:", error);
          return;
        }

        const { siteLanguage } = reduxState;
        const { uid, lang: language, authorUid } = reduxState.suttaPublicationInfo;

        function fetchSuttaplex(uid: string, language: string): Promise<SuttaplexData[]> {
          const url = `https://suttacentral.net/api/suttaplex/${uid}?language=${language}`;

          return fetch(url)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .catch(error => {
              console.error("There was a problem with the fetch operation:", error);
              return [];
            });
        }

        function countTranslations(data: Translation[], language: string, authorUid: string): number {
          return data.filter(item => item.lang === language && item.author_uid !== authorUid).length;
        }

        fetchSuttaplex(uid, siteLanguage)
          .then(data => {
            if (data.length > 0) {
              const translations = data[0].translations || []; // Default to empty array if translations is undefined
              const translationCount = countTranslations(translations, siteLanguage, authorUid);
              updateParallelButton(translationCount);
            }
          })
          .catch(error => {
            console.error("Error fetching suttaplex data:", error);
          });
      }

      observer = new MutationObserver(() => {
        processStateChange();
      });

      observer.observe(document, { subtree: true, childList: true });
      setInterval(processStateChange, 1000);

      runScript();
    }

    function updateParallelButton(translationCount: number) {
      const parallelButton = querySelectorDeep("#btnShowParallels");
      if (parallelButton) {
        let otherCount = parallelButton.querySelector(".otherCount") as HTMLElement;

        if (translationCount === 0 && otherCount) {
          otherCount.remove();
          return;
        }

        if (!otherCount) {
          otherCount = document.createElement("translation-counter");
          otherCount.classList.add("otherCount");
          otherCount.style.cssText = `
            background-color: var(--sc-primary-color-dark);
            font-size: .8rem;
            border-radius: 5px;
            color: white;
            position: absolute;
            top: 6px;
            right: -5px;
            height: 1rem;
            width: 1.2rem;
            padding: 4px 4px auto auto;
            z-index: 5000;
          `;

          parallelButton.style.position = "relative";
          parallelButton.appendChild(otherCount);
        }

        otherCount.innerHTML = `+${translationCount}`;
      }
    }

    // Initial check for the setting
    chrome.storage.sync.get("notifyAdditionalTranslation", data => {
      const isEnabled = data["notifyAdditionalTranslation"] === "true"; // Convert to boolean

      if (isEnabled) {
        startNotifications();
      } else {
        console.info("❌ Additional translation notification is disabled");
        stopNotifications();
      }
    });

    // Listen for changes in the storage
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "sync" && changes["notifyAdditionalTranslation"]) {
        const newValue = changes["notifyAdditionalTranslation"].newValue === "true";

        if (newValue) {
          console.info("✅ Additional translation notifications enabled");
          startNotifications(); // Start the notification logic
        } else {
          console.info("❌ Additional translation notifications disabled");
          stopNotifications(); // Stop the notification logic
        }
      }
    });
  },
});
