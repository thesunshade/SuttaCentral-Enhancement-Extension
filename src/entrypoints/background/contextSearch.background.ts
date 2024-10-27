export default defineBackground(() => {
  // Function to create context menu items based on settings
  const createContextMenus = (settings: any) => {
    console.log("Creating context menus with settings:", settings); // Debug log

    // Remove all existing context menus first
    chrome.contextMenus.removeAll(() => {
      console.log("Existing context menus removed"); // Debug log

      // Convert the settings to proper booleans
      const contextSearchSuttacentral = settings.contextSearchSuttacentral === "true";
      const contextSearchForum = settings.contextSearchForum === "true";
      const contextGoToSuttaplex = settings.contextGoToSuttaplex === "true";
      const contextGoToSutta = settings.contextGoToSutta === "true";
      const contextSearchPts = settings.contextSearchPts === "true";

      if (contextSearchSuttacentral) {
        chrome.contextMenus.create({
          id: "searchSuttaCentral",
          title: "🔍 Search SuttaCentral for '%s'",
          contexts: ["selection"],
        });
      }
      if (contextSearchForum) {
        chrome.contextMenus.create({
          id: "searchDD",
          title: "🗣️ Search D&&D for '%s'",
          contexts: ["selection"],
        });
      }
      if (contextGoToSuttaplex) {
        chrome.contextMenus.create({
          id: "goToCitationSuttaplex",
          title: "📕 Go to Suttaplex for citation: '%s'",
          contexts: ["selection"],
        });
      }
      if (contextGoToSutta) {
        chrome.contextMenus.create({
          id: "goToCitation",
          title: "📙 Go to citation: '%s'",
          contexts: ["selection"],
        });
      }
      if (contextSearchPts) {
        chrome.contextMenus.create({
          id: "searchPtsCitation",
          title: "📗 Lookup PTS citation for '%s'",
          contexts: ["selection"],
        });
      }
    });
  };

  // Function to load settings from storage or use defaults from settingsConfig.ts
  function loadSettings(callback: (settings: any) => void) {
    chrome.storage.sync.get(["contextSearchSuttacentral", "contextSearchForum", "contextGoToSuttaplex", "contextGoToSutta", "contextSearchPts"], storedSettings => {
      // Merge stored settings with defaults, stored settings take precedence
      const finalSettings = { ...storedSettings };
      callback(finalSettings);
    });
  }

  // Load settings and create context menus on installation
  chrome.runtime.onInstalled.addListener(() => {
    loadSettings(createContextMenus);
  });

  // Listen for changes to the settings and update menus dynamically
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync") {
      const updatedSettings: any = {};
      for (const key in changes) {
        updatedSettings[key] = changes[key].newValue;
      }

      console.log("Settings changed:", updatedSettings); // Debug log

      // Fetch the latest settings, merging updated ones
      loadSettings(settings => {
        const mergedSettings = { ...settings, ...updatedSettings };
        createContextMenus(mergedSettings);
      });
    }
  });

  // Handle context menu item clicks
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (!info.selectionText) {
      // If selectionText is undefined or empty, exit early.
      return;
    }
    const citation = sanitizePotentialCitation(info.selectionText);
    const searchString = encodeURIComponent(info.selectionText);
    if (info.selectionText) {
      if (info.menuItemId === "searchSuttaCentral") {
        const searchUrl = `https://suttacentral.net/search?query=${searchString}`;
        chrome.tabs.create({ url: searchUrl });
      } else if (info.menuItemId === "searchDD") {
        const searchUrl = `https://discourse.suttacentral.net/search?q=${searchString}`;
        chrome.tabs.create({ url: searchUrl });
      } else if (info.menuItemId === "goToCitationSuttaplex") {
        const url = `https://suttacentral.net/${citation}`;
        chrome.tabs.create({ url: url });
      } else if (info.menuItemId === "goToCitation") {
        const url = `https://suttacentral.net/${citation}/xx/xx`;
        chrome.tabs.create({ url: url });
      } else if (info.menuItemId === "searchPtsCitation") {
        const searchUrl = `https://suttacentral.net/search?query=volpage:${searchString}`;
        chrome.tabs.create({ url: searchUrl });
      }
    }
  });

  function sanitizePotentialCitation(potentialCitation: string) {
    let citation = potentialCitation.replace(/ /g, "").replace(":", ".").trim().toLowerCase();
    return encodeURIComponent(citation);
  }
});
