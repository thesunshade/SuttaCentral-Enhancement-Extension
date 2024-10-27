export default defineBackground(() => {
  // dynamically loading `hoverForBlurbs.content.ts`
  async function updateHoverBlurbsContentScript() {
    function processExcludeSites(sites: string): string[] {
      console.log("Processing exclude sites:", sites);
      const processed = sites
        .split("\n")
        .map(site => site.trim())
        .map(site => site.replace(/^(https?:\/\/)?(www\.)?/, ""))
        .map(site => site.split("/")[0])
        .filter(Boolean)
        .map(site => `*://${site}/*`);
      console.log("Processed exclude sites:", processed);
      return processed;
    }

    console.log("Attempting to register content script");
    try {
      const result = await chrome.storage.sync.get("showBlurbsExcludeSites");
      const showBlurbsExcludeSites = result.showBlurbsExcludeSites || "";
      console.log("Fetched showBlurbsExcludeSites:", showBlurbsExcludeSites);
      const excludeMatches = processExcludeSites(showBlurbsExcludeSites);

      // Try to unregister existing script, but don't throw an error if it doesn't exist
      try {
        await chrome.scripting.unregisterContentScripts({
          ids: ["hover-for-blurbs"],
        });
        console.log("Unregistered existing content script");
      } catch (unregisterError) {
        console.log("No existing content script to unregister, proceeding with registration");
      }

      // Now register the new script
      await chrome.scripting.registerContentScripts([
        {
          id: "hover-for-blurbs",
          matches: ["<all_urls>"],
          excludeMatches: excludeMatches,
          js: ["/content-scripts/hoverForBlurbs.js"],
          runAt: "document_idle",
        },
      ]);
      console.log("Content script registered successfully");

      // Verify registration
      const registeredScripts = await chrome.scripting.getRegisteredContentScripts();
      console.log("Currently registered scripts:", registeredScripts);
    } catch (error) {
      console.error("Error during content script registration:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
    }
  }

  // Call this function when your extension starts up
  updateHoverBlurbsContentScript().catch(error => {
    console.error("Failed to register content script on startup:", error);
  });

  // Listen for changes to the showBlurbsExcludeSites setting
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.showBlurbsExcludeSites) {
      console.log("showBlurbsExcludeSites changed. New value:", changes.showBlurbsExcludeSites.newValue);
      updateHoverBlurbsContentScript().catch(error => {
        console.error("Failed to update content script after settings change:", error);
      });
    }
  });
});
