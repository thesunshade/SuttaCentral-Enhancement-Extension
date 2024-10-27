import checkOmniboxSetting from "../functions/checkOmniboxSetting.js";
import { settingsConfig } from "../data/settingsConfig.js";

export default defineBackground(() => {
  const typedSettingsConfig: SettingsConfigType = settingsConfig as SettingsConfigType;

  type SettingConfig = {
    label?: string;
    type: string;
    choices?: string[];
    default?: string;
  };

  type SettingsConfigType = {
    [key: string]: SettingConfig;
  };

  // Initiate settings
  chrome.runtime.onInstalled.addListener(details => {
    const defaultSettings: { [key: string]: any } = {};

    Object.entries(typedSettingsConfig)
      .filter(([, setting]) => !["heading", "paragraph", "details"].includes(setting.type))
      .forEach(([key, setting]) => {
        defaultSettings[key] = setting.default;
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
        if (tabs.length > 0 && tabs[0].id !== undefined) {
          // Ensure there's at least one active tab and it has an id
          chrome.tabs.reload(tabs[0].id);
        }
      });
    }
  });

  // Call this function initially to check the setting
  checkOmniboxSetting();

  // Listener to update feature when settings change
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.searchFromUrlBar) {
      console.log("Detected change in searchFromUrlBar setting");
      checkOmniboxSetting();
    }
  });
});
