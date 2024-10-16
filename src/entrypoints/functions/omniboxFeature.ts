import { allSuttasPaliNameArray } from "../data/allSuttasPaliNameArray";

export default function omniboxFeature() {
  const BASE_URL = "https://suttacentral.net";
  const SEARCH_URL = `${BASE_URL}/search`;

  // Preprocess the sutta data for faster search
  const processedSuttas = allSuttasPaliNameArray.map(sutta => {
    const [title, id] = sutta.split(" | ");
    return {
      title: normalizeString(title),
      id: normalizeString(id),
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
    const normalizedText = normalizeString(text);

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
        .filter(sutta => sutta.title.includes(normalizedText) || sutta.id.includes(normalizedText))
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
      // Check if input matches a sutta using normalized text
      const normalizedText = normalizeString(text);
      const matchedSutta = processedSuttas.find(sutta => sutta.title.includes(normalizedText) || sutta.id.includes(normalizedText));
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

  // Normalization function for fuzzy matching
  function normalizeString(str: string): string {
    return (
      str
        .normalize("NFD") // Decompose diacritics
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        // .replace(/[\s,;.“”'"’/()-]/g, "") // Remove spaces and punctuation
        .toLowerCase()
        .replace(/kh/gi, "k")
        .replace(/gh/gi, "g")
        .replace(/ch/gi, "c")
        .replace(/jh/gi, "j")
        .replace(/th/gi, "t")
        .replace(/dh/gi, "d")
        .replace(/ph/gi, "p")
        .replace(/bh/gi, "b")
        .replace(/kk/gi, "k")
        .replace(/gg/gi, "g")
        .replace(/cc/gi, "c")
        .replace(/jj/gi, "j")
        .replace(/tt/gi, "t")
        .replace(/dd/gi, "d")
        .replace(/pp/gi, "p")
        .replace(/bb/gi, "b")
        .replace(/mm/gi, "m")
        .replace(/yy/gi, "y")
        .replace(/rr/gi, "r")
        .replace(/ll/gi, "l")
        .replace(/vv/gi, "v")
        .replace(/ss/gi, "s")
    );
  }
}
