// This adds root texts (e.g. Pāli) to legacy texts

function insertRoot(path: string) {
  const pathParts = path.split("/");
  if (pathParts.length !== 4) {
    return;
  }
  const uid = pathParts[1];
  const authorUid = pathParts[3];
  const lang = pathParts[2];

  const SUTTA_API_URL = `https://suttacentral.net/api/suttas/${uid}/${authorUid}?lang=${lang}`;

  fetch(SUTTA_API_URL)
    .then(response => {
      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json(); // Parse the response as JSON
    })
    .then(data => {
      if (data.segmented === true) {
        return;
      }

      const BILARA_SUTTAS_API_URL = `https://suttacentral.net/api/bilarasuttas/${uid}/${authorUid}`;

      fetch(BILARA_SUTTAS_API_URL)
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
          }
          return response.json(); // Parse the response as JSON
        })
        .then(data => {
          //this contains the root data
          const rootInHtml = createRootInHtml(data);

          setTimeout(() => {
            //TODO this is not a great way to do this
            const main = document.getElementById("simple_text_content");
            const rootElement = document.createElement("div");
            rootElement.innerHTML = rootInHtml;
            rootElement.style.minWidth = "50vw";
            const rootStyle = document.createElement("style");
            rootStyle.innerText = `.sutta-title {word-break: break-word;}
            .reference a {
                font-family: var(--sc-sans-font);
                font-size: var(--sc-font-size-xxs);
                font-weight: 400;
                font-style: normal;
                display: inline-block;
                box-sizing: border-box;
                margin-right: 0.5em;
                padding: 0.1em 0.5em;
                text-align: left;
                text-indent: 0;
                text-transform: none;
                white-space: nowrap;
                letter-spacing: normal;
                color: var(--sc-on-primary-secondary-text-color);
                border: 1px solid var(--sc-border-color);
                border-radius: 8px;
                background-color: var(--sc-secondary-background-color);
                font-variant-caps: normal;
                   } 
                .sutta-title {
                    word-break: break-word;
                }
`;
            if (main) {
              main.appendChild(rootStyle);
              main.appendChild(rootElement);
            }
            const legacyArticles = document.querySelectorAll("main#simple_text_content article");

            for (let i = 0; i < legacyArticles.length; i++) {
              const article = legacyArticles[i] as HTMLElement; // Cast to HTMLElement
              article.style.maxHeight = "100vh";
              article.style.overflowY = "scroll";
            }
          }, 1000);
        });
    })
    .catch(error => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function createRootInHtml(jsonData: any) {
  const { keys_order, root_text, html_text } = jsonData;
  let result = "";

  keys_order.forEach((key: string) => {
    const id = key.split(":")[1];
    const rootValue = `<span class="root"><span class="reference"><a class="sc" id="${id}" href="#${id}" title="SuttaCentral segment number">${id}</a></span>${root_text[key]}</span>`;
    const htmlTemplate = html_text[key];
    result += htmlTemplate.replace("{}", rootValue);
  });
  return result.replace(/id='.+?'/, "");
}

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    // Check the setting before running the script
    chrome.storage.sync.get("rootOnLegacy", data => {
      const isEnabled = data["rootOnLegacy"] === "true"; // Convert to boolean

      if (!isEnabled) {
        return; // Exit if the setting is not enabled
      }
      console.info("🌲rootOnLegacy is active");

      // main code goes here

      let lastPath = window.location.pathname;

      // trigger on page load
      insertRoot(lastPath);

      const observer = new MutationObserver(() => {
        const currentPath = window.location.pathname;

        // Only log if the URL has changed
        if (currentPath !== lastPath) {
          insertRoot(currentPath);
          lastPath = currentPath; // Update lastUrl
        }
      });

      // Observe changes to the document
      observer.observe(document, { childList: true, subtree: true });
    });
  },
});
