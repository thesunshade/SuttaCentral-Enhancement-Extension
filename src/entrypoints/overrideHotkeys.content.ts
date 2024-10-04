import isInputFocused from "./functions/isInputFocused.js";

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    console.info("⌨️ make key substitutions with debugging");

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

    document.addEventListener("keydown", function (event) {
      // Debugging the pressed key
      //   console.log("Key pressed:", event.key);

      // Don't trigger spoofing if an input, textarea, select, button, or contenteditable is focused
      if (isInputFocused()) {
        // console.log("Input is focused, no spoofing."); // Log if we're skipping due to focus
        return;
      }

      // Check if the pressed key has a corresponding substitution
      const spoofedKey = keySubstitutions[event.key];
      if (spoofedKey) {
        // console.log(`Spoofing key '${event.key}' to '${spoofedKey}'`); // Log key substitution
        // Prevent default action for the original key
        event.preventDefault();

        // Create a new keyboard event for the spoofed key
        const spoofedEvent = new KeyboardEvent("keydown", {
          key: spoofedKey, // Key to spoof
          code: `Key${spoofedKey.toUpperCase()}`, // Corresponding code for the spoofed key
          keyCode: spoofedKey === "Escape" ? 27 : spoofedKey.charCodeAt(0), // 'Escape' key code or character code
          which: spoofedKey === "Escape" ? 27 : spoofedKey.charCodeAt(0), // 'Escape' key or character code
          bubbles: true, // Ensures the event propagates up the DOM
          cancelable: true, // Allow canceling the event if needed
        });

        // Dispatch the spoofed key event
        document.dispatchEvent(spoofedEvent);
      }
    });
  },
});
