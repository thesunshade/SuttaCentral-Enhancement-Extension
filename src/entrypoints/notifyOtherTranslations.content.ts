import { querySelectorDeep } from "query-selector-shadow-dom";

chrome.storage.sync.get(null, items => {
  console.log("Stored items in sync storage:", items);
});

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

    // Check the setting before running the script
    chrome.storage.sync.get("notifyAdditionalTranslation", data => {
      const isEnabled = data["notifyAdditionalTranslation"] === "true"; // Convert to boolean

      if (isEnabled) {
        runNotifyAdditionalTranslations(); // Run the main script logic
      } else {
        console.info("❌ Additional translation notification is disabled");
        stopNotifyAdditionalTranslations(); // Stop any running processes if needed
      }
    });
  },
});

// Main logic for notification of other translations
function runNotifyAdditionalTranslations() {
  let lastProcessedState: string | null = null;
  let debounceTimer: NodeJS.Timeout | null = null;

  function debounce(func: () => void, delay: number) {
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(func, delay);
    };
  }

  const debouncedRunScript = debounce(runScript, 500); // Wait 500ms after last state change

  function processStateChange() {
    const currentState = localStorage.reduxState;
    if (currentState !== lastProcessedState) {
      lastProcessedState = currentState;
      debouncedRunScript();
    }
  }

  function runScript() {
    const reduxState: ReduxState = JSON.parse(localStorage.reduxState);
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

    fetchSuttaplex(uid, siteLanguage).then(data => {
      if (data.length > 0) {
        const translations = data[0].translations;
        const translationCount = countTranslations(translations, siteLanguage, authorUid);
        updateParallelButton(translationCount);
      }
    });
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

  const observer = new MutationObserver(() => {
    processStateChange();
  });

  observer.observe(document, { subtree: true, childList: true });
  setInterval(processStateChange, 1000);

  runScript();

  return () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    observer.disconnect();
  };
}

// Stop function to clean up if the setting is unchecked
function stopNotifyAdditionalTranslations() {
  // Implement any clean-up logic here (e.g., stop MutationObservers or remove elements)
  console.info("🚫 Stopped notifyAdditionalTranslations script");
}
