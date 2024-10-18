import isInputFocused from "./functions/isInputFocused.js";

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    console.info("⌨️ make key substitutions");

    // Define key substitutions as an object
    const keySubstitutions: { [key: string]: string } = {
      "1": "v",
      "2": "s",
      "3": "n",
      "4": "m",
      "5": "t",
      "6": "r",
      "7": "i",
      "8": "o",
      "9": "p",
      "0": "Escape", // Example for ESC key
    };

    // The keydown event handler that performs the spoofing
    function keyHandler(event: KeyboardEvent) {
      // Don't trigger spoofing if an input, textarea, select, button, or contenteditable is focused
      if (isInputFocused()) {
        return;
      }

      // Check if the pressed key has a corresponding substitution
      const spoofedKey = keySubstitutions[event.key];
      if (spoofedKey) {
        event.preventDefault();

        // Create and dispatch a new keyboard event for the spoofed key
        const spoofedEvent = new KeyboardEvent("keydown", {
          key: spoofedKey, // Key to spoof
          code: `Key${spoofedKey.toUpperCase()}`, // Corresponding code for the spoofed key
          keyCode: spoofedKey === "Escape" ? 27 : spoofedKey.charCodeAt(0), // 'Escape' key code or character code
          which: spoofedKey === "Escape" ? 27 : spoofedKey.charCodeAt(0), // 'Escape' key or character code
          bubbles: true,
          cancelable: true,
        });

        document.dispatchEvent(spoofedEvent);
      }
    }

    // Function to start key mirroring
    function mirrorHotkeys() {
      document.addEventListener("keydown", keyHandler);
    }

    // Function to stop key mirroring
    function unMirrorHotkeys() {
      document.removeEventListener("keydown", keyHandler);
    }

    // Fetch the current mirrorHotkeys setting and apply the relevant logic
    chrome.storage.sync.get("mirrorHotkeys", result => {
      if (result.mirrorHotkeys === "true") {
        mirrorHotkeys();
      } else {
        unMirrorHotkeys();
      }
    });

    // Watch for changes in the mirrorHotkeys setting
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "sync" && changes.mirrorHotkeys) {
        if (changes.mirrorHotkeys.newValue === "true") {
          mirrorHotkeys();
        } else {
          unMirrorHotkeys();
        }
      }
    });
  },
});
