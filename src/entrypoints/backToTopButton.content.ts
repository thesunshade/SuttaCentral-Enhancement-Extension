export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  async main() {
    // Variables to store the button and event listener references
    let scrollToTopButton: HTMLButtonElement | null = null;
    let hideTimeout: NodeJS.Timeout;
    let scrollListener: () => void;
    let clickListener: () => void;

    function addButtonFunctionality() {
      if (!scrollToTopButton) {
        scrollToTopButton = document.createElement("button");
        scrollToTopButton.innerHTML = `<svg width="30" height="30" viewBox="0 0 24 24" fill="var(--sc-primary-background-color)" stroke-width=".168">
              <path d="M17.657 15.657a1 1 0 0 1-.707-.293L12 10.414l-4.95 4.95a1 1 0 0 1-1.414-1.414l5.657-5.657a1 1 0 0 1 1.414 0l5.657 5.657a1 1 0 0 1-.707 1.707z"/>
            </svg>`;
        scrollToTopButton.style.cssText = `
              position: fixed;
              bottom: 20px;
              right: 20px;
              padding: 10px 10px 5px 10px;
              font-size: 16px;
              background-color: var(--sc-primary-color);
              border: none;
              border-radius: 5px;
              cursor: pointer;
              z-index: 1000;
              opacity: 0;
              display: none;
              transition: opacity 500ms ease;
            `;

        document.body.appendChild(scrollToTopButton);

        clickListener = () => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        };
        scrollToTopButton.addEventListener("click", clickListener);
      }

      scrollListener = () => {
        if (window.scrollY > 200) {
          scrollToTopButton!.style.display = "block";
          scrollToTopButton!.style.opacity = "0.8";
          clearTimeout(hideTimeout);
          hideTimeout = setTimeout(() => {
            scrollToTopButton!.style.opacity = "0";
            hideTimeout = setTimeout(() => {
              scrollToTopButton!.style.display = "none";
            }, 500); // Matches the opacity transition duration
          }, 2000);
        }
      };

      window.addEventListener("scroll", scrollListener);
    }

    function cleanupListeners() {
      if (scrollToTopButton) {
        window.removeEventListener("scroll", scrollListener);
        scrollToTopButton.removeEventListener("click", clickListener);
        clearTimeout(hideTimeout);
        scrollToTopButton.remove();
        scrollToTopButton = null;
      }
    }

    // Check the initial value of 'backToTopButton' from sync storage
    chrome.storage.sync.get("backToTopButton", result => {
      if (result.backToTopButton === "true") {
        addButtonFunctionality();
      } else {
        cleanupListeners();
      }
    });

    // Add a listener to detect changes in 'backToTopButton'
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "sync" && changes.backToTopButton) {
        const newValue = changes.backToTopButton.newValue;
        if (newValue === "true") {
          addButtonFunctionality();
        } else if (newValue === "false") {
          cleanupListeners();
        }
      }
    });
  },
});
