import isInputFocused from "./functions/isInputFocused";
import showToastNotification from "./functions/showToastNotification";
import onlyPressed from "./functions/onlyPressed";

// Utility to map placeholders to actual data fields
const placeholderMap = {
  title: "title",
  author: "author",
  citation: "citation",
  pali: "originalTitle",
  date: "publication_date",
  language: "language",
  link: "link",
  clean: "clean",
  suttaplex: "suttaplex",
};

// Replace placeholders in a template string with corresponding values
function composeString(template: string, values: { [key: string]: string | null }): string {
  return template.replace(/{(title|author|translation|citation|pali|date|language|link|clean|suttaplex)}/g, (_, placeholder) => {
    const key = placeholderMap[placeholder as keyof typeof placeholderMap] as string;
    return values[key] ?? "";
  });
}

// Fetch and store Sutta data in local storage
async function fetchAndStoreSuttaData(uid: string, authorUid: string) {
  try {
    const response = await fetch(`https://suttacentral.net/api/suttaplex/${uid}`);
    const data = await response.json();
    const { translations, original_title, acronym } = data[0];
    const foundTranslation = translations.find((translation: { author_uid: string }) => translation.author_uid === authorUid);

    const storedData = {
      title: foundTranslation?.title ?? null,
      author: foundTranslation?.author ?? null,
      citation: acronym,
      originalTitle: original_title,
      publication_date: foundTranslation?.publication_date ?? null,
      language: foundTranslation?.lang_name ?? null,
      uid,
    };

    chrome.storage.local.set({ suttaData: storedData });
  } catch (error) {
    console.error("Error fetching Sutta data:", error);
  }
}

// Observe changes in the DOM to trigger data fetching
function observeDOMForUpdates() {
  const observer = new MutationObserver(mutations => {
    if (mutations.some(mutation => mutation.type === "childList" && mutation.addedNodes.length > 0)) {
      const reduxState = localStorage.reduxState && JSON.parse(localStorage.reduxState);
      if (reduxState?.currentRoute) {
        const { suttaId, authorUid } = reduxState.currentRoute.params;
        fetchAndStoreSuttaData(suttaId, authorUid);
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Copy custom markdown link to the clipboard
function copyMarkdownLink() {
  chrome.storage.local.get("suttaData", data => {
    const suttaData = data.suttaData;
    if (suttaData?.author && suttaData?.title && suttaData?.citation) {
      const values = {
        author: suttaData.author,
        title: suttaData.title.trim(),
        citation: suttaData.citation,
        originalTitle: suttaData.originalTitle,
        publication_date: suttaData.publication_date,
        language: suttaData.language,
        link: window.location.href,
        clean: window.location.href.split("?")[0],
        suttaplex: `http://suttacentral.net/${suttaData.uid}`,
      };

      chrome.storage.sync.get("linkPattern", data => {
        const linkPattern = data.linkPattern || "";
        const finalString = composeString(linkPattern, values);

        navigator.clipboard
          .writeText(finalString)
          .then(() => showToastNotification("Custom link copied to clipboard!"))
          .catch(err => console.error("Failed to copy:", err));
      });
    } else {
      console.error("Sutta data is incomplete.");
    }
  });
}

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    chrome.storage.sync.get("copyCustomLink", ({ copyCustomLink }) => {
      if (copyCustomLink === "true") {
        console.log("⌨️ 'l' to copy markdown link is active");

        observeDOMForUpdates();
        document.addEventListener("keydown", event => {
          if (onlyPressed(event, "l") && !isInputFocused()) {
            copyMarkdownLink();
          }
        });

        // Initial fetch when the script loads
        const reduxState = localStorage.reduxState && JSON.parse(localStorage.reduxState);
        if (reduxState?.currentRoute) {
          const { suttaId, authorUid } = reduxState.currentRoute.params;
          fetchAndStoreSuttaData(suttaId, authorUid);
        }
      } else {
        console.log("❌ Copy markdown link is disabled");
      }
    });
  },
});
