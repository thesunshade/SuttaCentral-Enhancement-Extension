export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    chrome.storage.sync.get("rootOnLegacy", data => {
      const isEnabled = data["rootOnLegacy"] === "true";
      if (!isEnabled) return;

      console.log("🪟 Show root on legacy texts is active");

      // Initialize content observation
      handleContentObservation();
    });
  },
});

function handleContentObservation() {
  let disconnectMainObserver = observeMainElement();

  // Monitor URL changes and restart the observer when the URL changes
  observeSpaNavigation(() => {
    if (disconnectMainObserver) {
      disconnectMainObserver(); // Stop current observer
    }
    disconnectMainObserver = observeMainElement(); // Start fresh observer
  });
}

// Function to observe the `main#simple_text_content` element and its changes
function observeMainElement() {
  const observer = new MutationObserver(mutationsList => {
    mutationsList.forEach(mutation => {
      if (mutation.type === "childList") {
        const mainElement = document.querySelector("main#simple_text_content");

        if (mainElement && mainElement.textContent?.trim()) {
          console.log("Main element is added and filled with content");
          const disconnectMainContentObserver = observeMainContentChanges(mainElement);
          observer.disconnect(); // Stop observing for the main element
          return disconnectMainContentObserver;
        }
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => observer.disconnect();
}

// Function to observe changes in the content of the main element
function observeMainContentChanges(mainElement: Element) {
  const debouncedContentChange = debounce(() => {
    console.log("Debounced: Main content has changed");
    // main code goes here
    console.log("main code goes here");
  }, 100);

  const mainObserver = new MutationObserver(mutationsList => {
    mutationsList.forEach(mutation => {
      if (mutation.type === "childList" || mutation.type === "characterData") {
        debouncedContentChange();
      }
    });
  });

  mainObserver.observe(mainElement, {
    childList: true,
    characterData: true,
    subtree: true,
  });

  return () => mainObserver.disconnect();
}

// Utility function to debounce frequent calls
function debounce(callback: () => void, delay: number) {
  let timeout: NodeJS.Timeout | null = null;
  return () => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
  };
}

// Function to observe SPA navigation without polling
function observeSpaNavigation(onUrlChange: () => void) {
  let currentUrl = location.href;

  const checkUrlChange = () => {
    const newUrl = location.href;
    if (newUrl !== currentUrl) {
      currentUrl = newUrl;
      console.log("URL changed:", newUrl);
      onUrlChange();
    }
  };

  // Intercept history.pushState and history.replaceState
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    checkUrlChange(); // React to pushState calls
  };

  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    checkUrlChange(); // React to replaceState calls
  };

  // Listen to the popstate event (back/forward navigation)
  window.addEventListener("popstate", checkUrlChange);
}
