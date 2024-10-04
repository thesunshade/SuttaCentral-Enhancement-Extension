import isInputFocused from "./functions/isInputFocused";
import showToastNotification from "./functions/showToastNotification";
import onlyPressed from "./functions/onlyPressed";

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    console.info("⌨️ 'l' to copy markdown link is active");
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      // Check if the 'l' key is pressed
      if (onlyPressed(event, "l") && !isInputFocused()) {
        const pageTitle = document.title;
        const cleanedPageTitle = pageTitle.replace(":", "").split("—")[0];
        const pageUrl = window.location.href.split("?")[0];
        const markdownLink = `[${cleanedPageTitle}](${pageUrl})`;

        navigator.clipboard
          .writeText(markdownLink)
          .then(() => {
            showToastNotification("Markdown link copied to clipboard!");
          })
          .catch(err => {
            console.error("Failed to copy: ", err);
          });
      }
    });
  },
});
