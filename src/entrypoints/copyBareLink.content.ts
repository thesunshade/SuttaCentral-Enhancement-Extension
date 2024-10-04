import isInputFocused from "./functions/isInputFocused";
import showToastNotification from "./functions/showToastNotification";
import onlyPressed from "./functions/onlyPressed";

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    console.info("⌨️ 'u' to copy bare url is active");
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      if (onlyPressed(event, "u") && !isInputFocused()) {
        const url = window.location.href.split("?")[0];

        navigator.clipboard
          .writeText(url)
          .then(() => {
            showToastNotification("Url copied to clipboard!");
          })
          .catch(err => {
            console.error("Failed to copy: ", err);
          });
      }
    });
  },
});
