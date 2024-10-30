export default defineBackground(() => {
  // Function to create context menu items based on settings
  const createContextMenus = (settings: any) => {
    console.info("Creating context menus with settings:", settings); // Debug log

    // Remove all existing context menus first
    chrome.contextMenus.removeAll(() => {
      console.info("Existing context menus removed"); // Debug log

      // Convert the settings to proper booleans
      const contextSearchSuttacentral = settings.contextSearchSuttacentral === "true";
      const contextSearchForum = settings.contextSearchForum === "true";
      const contextGoToSuttaplex = settings.contextGoToSuttaplex === "true";
      const contextGoToSutta = settings.contextGoToSutta === "true";
      const contextSearchPts = settings.contextSearchPts === "true";
      const contextSearchDpd = settings.contextSearchDpd === "true";

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
      if (contextSearchDpd) {
        chrome.contextMenus.create({
          id: "searchDpdCitation",
          title: "📖 Lookup DPD entry for '%s'",
          contexts: ["selection"],
        });
      }
    });
  };

  // Function to load settings from storage or use defaults from settingsConfig.ts
  function loadSettings(callback: (settings: any) => void) {
    chrome.storage.sync.get(["contextSearchSuttacentral", "contextSearchForum", "contextGoToSuttaplex", "contextGoToSutta", "contextSearchPts", "contextSearchDpd"], storedSettings => {
      const finalSettings = { ...storedSettings };
      callback(finalSettings);
    });
  }

  // Load settings and create context menus on installation or startup
  const initializeContextMenus = () => {
    loadSettings(createContextMenus);
  };

  chrome.runtime.onInstalled.addListener(initializeContextMenus);
  chrome.runtime.onStartup.addListener(initializeContextMenus); // Adds listener at browser startup

  // Listen for changes to the settings and update menus dynamically
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync") {
      const updatedSettings: any = {};
      for (const key in changes) {
        updatedSettings[key] = changes[key].newValue;
      }

      console.log("Settings changed:", updatedSettings); // Debug log

      loadSettings(settings => {
        const mergedSettings = { ...settings, ...updatedSettings };
        createContextMenus(mergedSettings);
      });
    }
  });

  // Handle context menu item clicks
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (!info.selectionText) return;

    const citation = sanitizePotentialCitation(info.selectionText);
    const searchString = encodeURIComponent(info.selectionText);

    if (info.menuItemId === "searchSuttaCentral") {
      chrome.tabs.create({ url: `https://suttacentral.net/search?query=${searchString}` });
    } else if (info.menuItemId === "searchDD") {
      chrome.tabs.create({ url: `https://discourse.suttacentral.net/search?q=${searchString}` });
    } else if (info.menuItemId === "goToCitationSuttaplex") {
      chrome.tabs.create({ url: `https://suttacentral.net/${citation}` });
    } else if (info.menuItemId === "goToCitation") {
      chrome.tabs.create({ url: `https://suttacentral.net/${citation}/xx/xx` });
    } else if (info.menuItemId === "searchPtsCitation") {
      chrome.tabs.create({ url: `https://suttacentral.net/search?query=volpage:${searchString}` });
    } else if (info.menuItemId === "searchDpdCitation") {
      chrome.tabs.create({ url: `https://www.dpdict.net/?q=${searchString}` });
    }
  });

  function sanitizePotentialCitation(potentialCitation: string) {
    return encodeURIComponent(potentialCitation.replace(/ /g, "").replace(":", ".").trim().toLowerCase());
  }
});
