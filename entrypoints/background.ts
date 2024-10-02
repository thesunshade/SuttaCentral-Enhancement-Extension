import { allSuttasPaliNameArray } from "./ddBlurbs.content/allSuttasPaliNameArray.js";

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });

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

  omniboxFeature();

  chrome.runtime.onInstalled.addListener(() => {
    // SuttaCentral
    chrome.contextMenus.create({
      id: "searchSuttaCentral",
      title: "🔍 Search SuttaCentral for '%s'",
      contexts: ["selection"],
    });

    // D&D
    chrome.contextMenus.create({
      id: "searchDD",
      title: "🗣️ Search D&&D for '%s'",
      contexts: ["selection"],
    });
    // regular citation Suttaplex
    chrome.contextMenus.create({
      id: "goToCitationSuttaplex",
      title: "📕 Go to Suttaplex for citation: '%s'",
      contexts: ["selection"],
    });
    // regular citation text
    chrome.contextMenus.create({
      id: "goToCitation",
      title: "📙 Go to citation: '%s'",
      contexts: ["selection"],
    });
    // PTS citation
    chrome.contextMenus.create({
      id: "searchPtsCitation",
      title: "📗 Lookup PTS citation for '%s'",
      contexts: ["selection"],
    });
  });

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
      console.log(citation);
      const searchUrl = `https://suttacentral.net/${citation}/en/sujato`;
      chrome.tabs.create({ url: searchUrl });
    } else if (info.menuItemId === "searchPtsCitation" && info.selectionText) {
      const searchUrl = `https://suttacentral.net/search?query=volpage:${encodeURIComponent(info.selectionText)}`;
      chrome.tabs.create({ url: searchUrl });
    }
  });
});
