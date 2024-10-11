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

      // Variables to store the API data
      let author: string | null = null;
      let title: string | null = null;
      let citation: string | null = null;
      let uid: string | null = null;
      let originalTitle: string | null = null;
      let publication_date: string | null = null;
      let language: string | null = null;

      // Override the fetch function to intercept the API response
      const originalFetch = window.fetch;
      window.fetch = async function (...args) {
        // Only intercept the fetch call if it matches the suttaplex API
        if (args[0].startsWith("https://suttacentral.net/api/suttaplex")) {
          const response = await originalFetch.apply(this, args);
          const clonedResponse = response.clone();

          try {
            // Convert the cloned response to JSON and store the relevant data
            const data = await clonedResponse.json();
            const translations = data[0].translations;
            console.log(translations);
            originalTitle = data[0].original_title;
            citation = data[0].acronym; // Save the citation for later

            // Get the current route and match the author
            const currentRoute = JSON.parse(localStorage.reduxState).currentRoute;
            uid = currentRoute.params.suttaId;
            const authorUid = currentRoute.params.authorUid;
            const foundObject = translations.find(translation => translation.author_uid === authorUid);
            console.log(foundObject);
            // Save the relevant data for use in the keypress event
            title = foundObject ? foundObject.title : null;
            author = foundObject ? foundObject.author : null;
            language = foundObject ? foundObject.lang_name : null;
            publication_date = foundObject ? foundObject.publication_date : null;
          } catch (error) {
            console.error("Error parsing response as JSON:", error);
          }

          return response; // Return the original response to the page
        }

        // If not the suttaplex API, just pass through the fetch call
        return originalFetch.apply(this, args);
      };

      // Listen for the 'l' key press to copy the markdown link to the clipboard
      document.addEventListener("keydown", (event: KeyboardEvent) => {
        // Check if the 'l' key is pressed and no input element is focused
        if (onlyPressed(event, "l") && !isInputFocused()) {
          if (author && title && citation) {
            const values = {
              author: author,
              title: title,
              citation: citation,
              originalTitle: originalTitle,
              publication_date: publication_date,
              language: language,
              link: window.location.href,
              clean: window.location.href.split("?")[0],
              suttaplex: `http://suttacentral.net/${uid}`,
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
        }
      });
    });
  },
});
