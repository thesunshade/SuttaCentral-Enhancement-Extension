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

let lastArticleContent = ""; // Variable to store the last known article content

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    console.info("➕ show other translations active");
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
            // console.error("There was a problem with the fetch operation:", error);
            return [];
          });
      }

      function countTranslations(data: Translation[], language: string, authorUid: string): number {
        return data.filter(item => item.lang === language && item.author_uid !== authorUid).length;
      }

      fetchSuttaplex(uid, siteLanguage).then(data => {
        if (data.length > 0) {
          const translations = data[0].translations;
          const translationCount = countTranslations(translations, language, authorUid);
          //   console.log(`Number of translations in ${language} not by ${authorUid}: ${translationCount}`);

          setTimeout(() => {
            const parallelButton = querySelectorDeep("#btnShowParallels");
            if (parallelButton) {
              let otherCount = parallelButton.querySelector(".otherCount");

              if (!otherCount) {
                otherCount = document.createElement("translation-counter");
                otherCount.classList.add("otherCount");
                otherCount.style.backgroundColor = "var(--sc-primary-color-dark)";
                otherCount.style.fontSize = ".8rem";
                otherCount.style.borderRadius = "5px";
                otherCount.style.color = "white";
                otherCount.style.position = "absolute";
                otherCount.style.top = "6px";
                otherCount.style.right = "-5px";
                otherCount.style.height = "1rem";
                otherCount.style.width = "1.2rem";
                otherCount.style.padding = "4px 4px auto auto";
                otherCount.style.zIndex = "5000";

                parallelButton.style.position = "relative";
                parallelButton.appendChild(otherCount);
              }

              otherCount.innerHTML = `+${translationCount}`;
            }
          }, 1000);
        }
      });
    }

    // Polling mechanism
    setInterval(() => {
      const article = querySelectorDeep("article");
      if (article) {
        const currentContent = article.innerHTML;

        // Check if the article content has changed
        if (currentContent !== lastArticleContent) {
          //   console.log("Article content changed, re-running script...");
          lastArticleContent = currentContent; // Update last known content
          runScript(); // Call the runScript function to check for translations
        }
      } else {
        // console.warn("No article found on the page.");
      }
    }, 2000); // Check every 2 seconds

    // Run the script initially
    runScript();
  },
});
