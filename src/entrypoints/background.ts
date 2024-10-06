import { allSuttasPaliNameArray } from "./ddBlurbs.content/allSuttasPaliNameArray.js";
import { settingsConfig } from "./popup/settingsConfig.js";

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });

  // Initiate settings
  chrome.runtime.onInstalled.addListener(details => {
    const defaultSettings: { [key: string]: any } = {};

    // Loop through the settingsConfig to extract default values
    Object.keys(settingsConfig).forEach(key => {
      defaultSettings[key] = settingsConfig[key].default;
    });

    // Fetch existing settings
    chrome.storage.sync.get(null, items => {
      // If there are no settings (new install), set defaults
      if (Object.keys(items).length === 0) {
        chrome.storage.sync.set(defaultSettings, () => {
          console.log("Default settings initialized on install:", defaultSettings);
        });
      } else if (details.reason === "update") {
        // On update, merge new defaults with existing settings
        const mergedSettings = { ...defaultSettings, ...items }; // Existing settings take precedence
        chrome.storage.sync.set(mergedSettings, () => {
          console.log("Settings updated with new defaults:", mergedSettings);
        });
      }
    });
  });

  //refresh active tab
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "refreshActiveTab") {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (tabs.length > 0) {
          // Ensure there's at least one active tab
          chrome.tabs.reload(tabs[0].id); // Refresh the active tab
        }
      });
    }
  });

  function omniboxFeature() {
    const BASE_URL = "https://suttacentral.net";
    const SEARCH_URL = `${BASE_URL}/search`;

    // Preprocess the sutta data for faster search
    const processedSuttas = allSuttasPaliNameArray.map(sutta => {
      const [title, id] = sutta.split(" | ");
      return {
        title: title.toLowerCase(),
        id: id.toLowerCase(),
        original: sutta,
      };
    });

    // Set the default suggestion to guide the user
    browser.omnibox.setDefaultSuggestion({
      description: `Type "sc" followed by a string to search SuttaCentral.net, or select a sutta from the list`,
    });

    let debounceTimer: ReturnType<typeof setTimeout>;

    // Debounced input handler
    browser.omnibox.onInputChanged.addListener((text, addSuggestions) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        handleInput(text, addSuggestions);
      }, 300); // Adjust the delay as needed
    });

    function handleInput(text: string, addSuggestions: (suggestions: Array<{ content: string; description: string }>) => void) {
      const lowerCaseText = text.toLowerCase();

      if (text.startsWith("sc ")) {
        const searchQuery = text.slice(3); // remove the 'sc ' prefix
        addSuggestions([
          {
            content: `${SEARCH_URL}?query=${searchQuery}`, // Full search URL
            description: `Search SuttaCentral.net for "${searchQuery}"`,
          },
        ]);
      } else {
        // Suggest matching suttas from the preprocessed list
        const suggestions = processedSuttas
          .filter(sutta => sutta.title.includes(lowerCaseText) || sutta.id.includes(lowerCaseText))
          .slice(0, 10) // Limit to 10 suggestions for performance
          .map(sutta => {
            const [title, id] = sutta.original.split(" | ");
            return {
              content: id,
              description: `${title} (${id})`,
            };
          });

        addSuggestions(suggestions);
      }
    }

    // Handle the selection or pressing enter to construct the correct URL
    browser.omnibox.onInputEntered.addListener((text, disposition) => {
      let url;

      if (text.startsWith("sc ")) {
        const searchQuery = text.slice(3); // remove 'sc ' prefix
        url = `${SEARCH_URL}?query=${searchQuery}`;
      } else {
        // Check if input matches a sutta
        const matchedSutta = processedSuttas.find(sutta => sutta.title.includes(text.toLowerCase()) || sutta.id.includes(text.toLowerCase()));
        if (matchedSutta) {
          url = `https://suttacentral.net/${matchedSutta.id}/en/sujato`;
        } else {
          // Otherwise, default to a search
          url = `${SEARCH_URL}?query=${text}`;
        }
      }

      switch (disposition) {
        case "currentTab":
          browser.tabs.update({ url });
          break;
        case "newForegroundTab":
          browser.tabs.create({ url });
          break;
        case "newBackgroundTab":
          browser.tabs.create({ url, active: false });
          break;
      }
    });
  }

  // Function to check and execute based on setting
  function checkOmniboxSetting() {
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

  // Call this function initially to check the setting
  checkOmniboxSetting();

  // Listener to update feature when settings change
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.searchFromUrlBar) {
      console.log("Detected change in searchFromUrlBar setting");
      checkOmniboxSetting(); // Re-check when the setting changes
    }
  });

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
  const loadSettings = (callback: (settings: any) => void) => {
    chrome.storage.sync.get(["contextSearchSuttacentral", "contextSearchForum", "contextGoToSuttaplex", "contextGoToSutta", "contextSearchPts"], storedSettings => {
      // If no settings are stored, use defaults from settingsConfig.ts
      console.log("Stored settings:", storedSettings); // Debug log

      const defaultSettings = {
        contextSearchSuttacentral: settingsConfig.contextSearchSuttacentral.defaultValue || false,
        contextSearchForum: settingsConfig.contextSearchForum.defaultValue || false,
        contextGoToSuttaplex: settingsConfig.contextGoToSuttaplex.defaultValue || false,
        contextGoToSutta: settingsConfig.contextGoToSutta.defaultValue || false,
        contextSearchPts: settingsConfig.contextSearchPts.defaultValue || false,
      };

      // Merge stored settings with defaults, stored settings take precedence
      const finalSettings = { ...defaultSettings, ...storedSettings };
      callback(finalSettings);
    });
  };

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
    if (info.menuItemId === "searchSuttaCentral" && info.selectionText) {
      const searchUrl = `https://suttacentral.net/search?query=${encodeURIComponent(info.selectionText)}`;
      chrome.tabs.create({ url: searchUrl });
    } else if (info.menuItemId === "searchDD" && info.selectionText) {
      const searchUrl = `https://discourse.suttacentral.net/search?q=${encodeURIComponent(info.selectionText)}`;
      chrome.tabs.create({ url: searchUrl });
    } else if (info.menuItemId === "goToCitationSuttaplex" && info.selectionText) {
      const citation = encodeURIComponent(info.selectionText.replace(/ /g, "").trim());
      const searchUrl = `https://suttacentral.net/${citation}`;
      chrome.tabs.create({ url: searchUrl });
    } else if (info.menuItemId === "goToCitation" && info.selectionText) {
      const citation = encodeURIComponent(info.selectionText.replace(/ /g, "").trim());
      const searchUrl = `https://suttacentral.net/${citation}/en/sujato`;
      chrome.tabs.create({ url: searchUrl });
    } else if (info.menuItemId === "searchPtsCitation" && info.selectionText) {
      const searchUrl = `https://suttacentral.net/search?query=volpage:${encodeURIComponent(info.selectionText)}`;
      chrome.tabs.create({ url: searchUrl });
    }
  });
});
