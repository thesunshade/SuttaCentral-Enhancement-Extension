export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  async main() {
    let pathObserver: MutationObserver;
    let lastPath: string | null = null; // Allow `null` initially for TypeScript compatibility
    let rightArrowListener: (event: KeyboardEvent) => void;
    let leftArrowListener: (event: KeyboardEvent) => void;

    // Function to handle path change logging
    function handlePathChange() {
      const currentPath = window.location.pathname;
      if (currentPath !== lastPath) {
        lastPath = currentPath;
        console.log(currentPath); // Replace this with the API call if needed
        setupPreviousNextButtons(currentPath);
      }
    }

    function goNext(nextLink: string) {
      // Event listener function for the right-arrow key
      rightArrowListener = (event: KeyboardEvent) => {
        if (event.key === "ArrowRight") {
          window.location.href = nextLink;
          document.removeEventListener("keydown", rightArrowListener);
        }
      };

      // Add event listener for `keydown`
      document.addEventListener("keydown", rightArrowListener);
    }

    function goPrevious(previousLink: string) {
      // Event listener function for the left-arrow key
      leftArrowListener = (event: KeyboardEvent) => {
        if (event.key === "ArrowLeft") {
          window.location.href = previousLink;
          document.removeEventListener("keydown", leftArrowListener);
        }
      };

      // Add event listener for `keydown`
      document.addEventListener("keydown", leftArrowListener);
    }

    function setupPreviousNextButtons(path: string) {
      const pathParts = path.split("/");
      if (pathParts.length !== 4) {
        return;
      }
      const uid = pathParts[1];
      const authorUid = pathParts[3];
      const lang = pathParts[2];

      const SUTTA_API_URL = `https://suttacentral.net/api/suttas/${uid}/${authorUid}?lang=${lang}`;
      console.log(SUTTA_API_URL);
      fetch(SUTTA_API_URL)
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
          }
          return response.json(); // Parse the response as JSON
        })
        .then(data => {
          //this contains the root data
          console.log(data.translation);
          const previous = data.translation.previous;
          const next = data.translation.next;
          if (previous.name) {
            const previousUrl = `https://suttacentral.net/${previous.uid}/${previous.lang}/${previous.author_uid}`;
            console.log(previousUrl);
            goPrevious(previousUrl);
          }
          if (next.name) {
            const nextUrl = `https://suttacentral.net/${next.uid}/${next.lang}/${next.author_uid}`;
            console.log(nextUrl);
            goNext(nextUrl);
          }
        });
    }

    function startPreviousNextFunction() {
      console.log("thing done");

      // Observe changes to the URL's pathname
      pathObserver = new MutationObserver(() => handlePathChange());
      pathObserver.observe(document, { subtree: true, childList: true });

      // Log the initial path on load
      handlePathChange();
    }

    function stopPreviousNextFunction() {
      console.log("stop the thing");

      // Disconnect the observer if it exists
      if (pathObserver) {
        pathObserver.disconnect();
      }

      // Remove both arrow key listeners
      if (rightArrowListener) {
        document.removeEventListener("keydown", rightArrowListener);
      }
      if (leftArrowListener) {
        document.removeEventListener("keydown", leftArrowListener);
      }
    }

    // Initial check based on `previousNext` setting
    chrome.storage.sync.get("previousNext", result => {
      if (result.previousNext === "true") {
        startPreviousNextFunction();
      } else {
        stopPreviousNextFunction();
      }
    });

    // Listen for changes in `previousNext` and toggle listeners accordingly
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "sync" && changes.previousNext) {
        const newValue = changes.previousNext.newValue;
        if (newValue === "true") {
          startPreviousNextFunction();
        } else if (newValue === "false") {
          stopPreviousNextFunction();
        }
      }
    });
  },
});
