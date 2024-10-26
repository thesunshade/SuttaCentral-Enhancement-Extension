import { querySelectorDeep } from "query-selector-shadow-dom";

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  async main(cxt) {
    let arrowListener: (event: KeyboardEvent) => void;

    function createKeyboardListner() {
      function arrowListener(event: KeyboardEvent) {
        if (event.key === "ArrowRight") {
          const nextElement = querySelectorDeep("a:has(div.button-right)") as HTMLAnchorElement;
          if (nextElement) {
            nextElement.click();
          }
        } else if (event.key === "ArrowLeft") {
          const previousElement = querySelectorDeep("a:has(div.button-left)") as HTMLAnchorElement;
          if (previousElement) {
            previousElement.click();
          }
        }
      }
      document.addEventListener("keydown", arrowListener);
    }

    chrome.storage.sync.get("previousNext", result => {
      if (result.previousNext === "true") {
        createKeyboardListner();
      } else {
        document.removeEventListener("keydown", arrowListener);
      }
    });

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "sync" && changes.previousNext) {
        const newValue = changes.previousNext.newValue;
        if (newValue === "true") {
          createKeyboardListner();
        } else if (newValue === "false") {
          document.removeEventListener("keydown", arrowListener);
        }
      }
    });
  },
});
