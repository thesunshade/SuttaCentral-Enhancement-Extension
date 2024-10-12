function insertRoot(path: string) {
  const pathParts = path.split("/");
  console.log(pathParts);
  if (pathParts.length !== 4) {
    return;
  }
  const uid = pathParts[1];
  const authorUid = pathParts[3];

  const SUTTA_API_URL = `https://suttacentral.net/api/suttas/${uid}/${authorUid}`;
  console.log(SUTTA_API_URL);
  console.log(path);
  fetch(SUTTA_API_URL)
    .then(response => {
      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json(); // Parse the response as JSON
    })
    .then(data => {
      console.log(data); // Handle the JSON data here
      if (data.segmented === true) {
        return;
      }
      console.log("not segmented");
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
          console.log(data);
          const rootInHtml = createRootInHtml(data);
          console.log(rootInHtml);
          setTimeout(() => {
            //TODO this is not a great way to do this
            const main = document.getElementById("simple_text_content");
            console.log(main);
            const rootElement = document.createElement("div");
            rootElement.innerHTML = rootInHtml;
            rootElement.style.minWidth = "50vw";
            const rootStyle = document.createElement("style");
            rootStyle.innerText = ".sutta-title {word-break: break-word;}";
            main.appendChild(rootStyle);
            main.appendChild(rootElement);
            const articles = document.getElementsByTagName("article");
            for (let i = 0; i < articles.length; i++) {
              articles[i].style.maxHeight = "100vh";
              articles[i].style.overflowY = "scroll";
            }
          }, 300);
        });
    })
    .catch(error => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function createRootInHtml(jsonData: Object) {
  console.log("root in html data", jsonData);
  const { keys_order, root_text, html_text } = jsonData;
  let result = "";

  keys_order.forEach(key => {
    const rootValue = root_text[key];
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
      console.log("rootOnLegacy is active");

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
