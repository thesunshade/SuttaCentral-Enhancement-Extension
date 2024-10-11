import isInputFocused from "./functions/isInputFocused";
import showToastNotification from "./functions/showToastNotification";
import onlyPressed from "./functions/onlyPressed";

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    // Check the setting before running the script
    chrome.storage.sync.get("copyCustomLink", data => {
      const isEnabled = data["copyCustomLink"] === "true"; // Convert to boolean

      if (!isEnabled) {
        console.log("❌ Copy markdown link is disabled");
        return; // Exit if the setting is not enabled
      }

      console.log("⌨️ 'l' to copy markdown link is active");

      function composeString(template: string, values: { [key: string]: string | null }): string {
        // Replace placeholders with corresponding values
        return template.replace(/{(title|author|translation|citation|pali|date|language|link|clean|suttaplex)}/g, (_, placeholder) => {
          const keyMapping: { [key: string]: string } = {
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

          const key = keyMapping[placeholder];
          return values[key] ?? ""; // Replace with the value or an empty string if not available
        });
      }

      // Function to fetch and store data
      async function fetchAndStoreData() {
        const currentRoute = JSON.parse(localStorage.reduxState).currentRoute;
        const uid = currentRoute.params.suttaId;
        const authorUid = currentRoute.params.authorUid;

        try {
          const response = await fetch(`https://suttacentral.net/api/suttaplex/${uid}`);
          const data = await response.json();
          const translations = data[0].translations;
          const originalTitle = data[0].original_title;
          const citation = data[0].acronym;

          const foundObject = translations.find(translation => translation.author_uid === authorUid);

          const storedData = {
            title: foundObject ? foundObject.title : null,
            author: foundObject ? foundObject.author : null,
            citation: citation,
            originalTitle: originalTitle,
            publication_date: foundObject ? foundObject.publication_date : null,
            language: foundObject ? foundObject.lang_name : null,
            uid: uid,
          };

          chrome.storage.local.set({ suttaData: storedData });
        } catch (error) {
          console.error("Error fetching or storing data:", error);
        }
      }

      // Set up MutationObserver to detect when new content is loaded
      const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            fetchAndStoreData();
            break;
          }
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      // Initial fetch when the script loads
      fetchAndStoreData();

      // Listen for the 'l' key press to copy the markdown link to the clipboard
      document.addEventListener("keydown", (event: KeyboardEvent) => {
        // Check if the 'l' key is pressed and no input element is focused
        if (onlyPressed(event, "l") && !isInputFocused()) {
          chrome.storage.local.get("suttaData", data => {
            const suttaData = data.suttaData;
            if (suttaData && suttaData.author && suttaData.title && suttaData.citation) {
              const values = {
                author: suttaData.author,
                title: suttaData.title,
                citation: suttaData.citation,
                originalTitle: suttaData.originalTitle,
                publication_date: suttaData.publication_date,
                language: suttaData.language,
                link: window.location.href,
                clean: window.location.href.split("?")[0],
                suttaplex: `http://suttacentral.net/${suttaData.uid}`,
              };

              // Retrieve the link pattern from chrome storage and then compose the final string
              chrome.storage.sync.get("linkPattern", data => {
                const linkPattern = data.linkPattern || ""; // Default to an empty string if not found

                // Compose the final string with the retrieved link pattern
                const finalString = composeString(linkPattern, values);

                // Copy the final string to the clipboard
                navigator.clipboard
                  .writeText(finalString)
                  .then(() => {
                    showToastNotification("Custom link copied to clipboard!");
                  })
                  .catch(err => {
                    console.error("Failed to copy: ", err);
                  });
              });
            } else {
              console.error("Author, title, or citation data is not available yet.");
            }
          });
        }
      });
    });
  },
});
