import omniboxFeature from "./omniboxFeature";

// Function to check and execute based on setting
export default function checkOmniboxSetting() {
  chrome.storage.sync.get(["searchFromUrlBar"], result => {
    console.log(`Loaded searchFromUrlBar setting: ${result.searchFromUrlBar}`);

    if (result.searchFromUrlBar === "true") {
      console.log("Enabling omnibox feature");
      omniboxFeature(); // Call the feature if setting is true
    } else {
      console.log("Disabling omnibox feature");
      // Disable the omnibox feature by clearing its suggestion
      browser.omnibox.setDefaultSuggestion({
        description: "Omnibox feature is disabled",
      });
    }
  });
}
