import { querySelectorDeep } from "query-selector-shadow-dom";

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

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    console.info("➕ show other translations active");

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

      //   console.log("Running script with:", { uid, language, authorUid });

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
          // console.log(data);
          const translations = data[0].translations;
          const translationCount = countTranslations(translations, siteLanguage, authorUid);
          //   console.log(`Number of translations in ${language} not by ${authorUid}: ${translationCount}`);

          updateParallelButton(translationCount);
        }
      });
    }

    function updateParallelButton(translationCount: number) {
      const parallelButton = querySelectorDeep("#btnShowParallels");
      if (parallelButton) {
        let otherCount = parallelButton.querySelector(".otherCount") as HTMLElement;

        // If translationCount is 0, remove the otherCount element if it exists
        if (translationCount === 0) {
          if (otherCount) {
            otherCount.remove();
          }
          return; // No need to proceed if translationCount is 0
        }

        // If translationCount is greater than 0, update or create the otherCount element
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

        // Update the content with the translation count
        otherCount.innerHTML = `+${translationCount}`;
      }
    }

    // Set up a MutationObserver to watch for changes in localStorage
    const observer = new MutationObserver(() => {
      processStateChange();
    });

    observer.observe(document, { subtree: true, childList: true });

    // Also check periodically in case the MutationObserver misses something
    setInterval(processStateChange, 1000);

    // Run the script initially
    runScript();

    // Clean up function
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      observer.disconnect();
    };
  },
});
