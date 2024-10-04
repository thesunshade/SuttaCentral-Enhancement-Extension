import { querySelectorDeep } from "query-selector-shadow-dom";

interface ReduxState {
  siteLanguage: string;
  suttaPublicationInfo: {
    uid: string;
    lang: string;
    authorUid: string;
  };
}

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    console.info("➕ show Pali parallels count active");

    let lastProcessedState: string | null = null;
    let debounceTimer: NodeJS.Timeout | null = null;

    function debounce(func: () => void, delay: number) {
      return () => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(func, delay);
      };
    }

    const debouncedRunScript = debounce(runScript, 500);

    function processStateChange() {
      const currentState = localStorage.reduxState;
      if (currentState !== lastProcessedState) {
        lastProcessedState = currentState;
        debouncedRunScript();
      }
    }

    function runScript() {
      const reduxState: ReduxState = JSON.parse(localStorage.reduxState);
      const { uid } = reduxState.suttaPublicationInfo;

      function fetchParallels(uid: string): Promise<any> {
        const url = `https://suttacentral.net/api/parallels/${uid}`;

        return fetch(url)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .catch(error => {
            console.error("There was a problem with the fetch operation:", error);
            return null;
          });
      }

      function countPliLang(obj: any): number {
        let count = 0;

        if (obj && obj.to && obj.to.root_lang === "pli") {
          count++;
        }

        for (let key in obj) {
          if (Array.isArray(obj[key])) {
            for (let item of obj[key]) {
              count += countPliLang(item);
            }
          } else if (typeof obj[key] === "object" && obj[key] !== null) {
            count += countPliLang(obj[key]);
          }
        }

        return count;
      }

      fetchParallels(uid).then(data => {
        if (data) {
          const paliCount = countPliLang(data);
          // console.log(`Number of Pali parallels: ${paliCount}`);
          updateParallelButton(paliCount);
        }
      });
    }

    function updateParallelButton(paliCount: number) {
      const parallelButton = querySelectorDeep("#btnShowParallels");
      if (parallelButton) {
        let paliCountElement = parallelButton.querySelector(".paliCount") as HTMLElement;

        if (paliCount === 0) {
          if (paliCountElement) {
            paliCountElement.remove();
          }
          return;
        }

        if (!paliCountElement) {
          paliCountElement = document.createElement("pali-counter");
          paliCountElement.classList.add("paliCount");
          paliCountElement.style.cssText = `
              font-size: .8rem;
              border-radius: 5px;
              color: white;
              position: absolute;
              top: 4px;
              left: -6px;
              height: 1rem;
              padding: 4px 4px auto auto;
              z-index: 5000;
            `;

          parallelButton.style.position = "relative";
          parallelButton.appendChild(paliCountElement);
        }

        paliCountElement.innerHTML = `<small style="font-size:.6rem;vertical-align: super">⇄</small>${paliCount}`;
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
  },
});
