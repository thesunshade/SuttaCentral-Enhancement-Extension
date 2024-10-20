// gives the discussion forum its own favicon

export default defineContentScript({
  matches: ["*://discourse.suttacentral.net/*"],
  main() {
    // Function to update the favicon
    function updateFavicon(isEnabled: boolean) {
      //   console.log(`updateFavicon called. isEnabled: ${isEnabled}`);

      // Create or update the favicon link
      const faviconUrl = isEnabled ? chrome.runtime.getURL("icon/ddFavicon.png") : chrome.runtime.getURL("icon/favicon.ico");
      let linkElement = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;

      // If no favicon element exists, create one
      if (!linkElement) {
        linkElement = document.createElement("link");
        linkElement.rel = "icon";
        linkElement.type = "image/png"; // Set to PNG for ddFavicon
        document.head.appendChild(linkElement);
        // console.log("New favicon appended to head.");
      }

      // Update the favicon's href
      linkElement.href = faviconUrl; // This should set it to either ddFavicon or default favicon
      //   console.log("Favicon updated to:", linkElement.href);
    }

    // Fetch the initial state from chrome.storage.sync
    chrome.storage.sync.get("ddFavicon", result => {
      const isEnabled = result.ddFavicon === "true"; // storage values are strings
      //   console.log("Initial ddFavicon value:", isEnabled);
      updateFavicon(isEnabled);
    });

    // Listen for changes in chrome.storage.sync
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "sync" && changes.ddFavicon) {
        const isEnabled = changes.ddFavicon.newValue === "true"; // storage values are strings
        // console.log("ddFavicon changed to:", isEnabled);
        updateFavicon(isEnabled);
      }
    });
  },
});
