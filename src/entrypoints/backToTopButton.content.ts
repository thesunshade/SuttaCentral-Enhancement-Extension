export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  async main(cxt) {
    // Variables to store the button and event listener references
    let scrollToTopButton: HTMLButtonElement | null = null;
    let hideTimeout: NodeJS.Timeout;
    let scrollListener: () => void;
    let clickListener: () => void;

    // Functions to execute based on the setting
    function addButtonFunctionality() {
      console.log("thing done");

      // Create the button
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
          transition: opacity 500ms ease;
        `;

      // Add button to the page
      document.body.appendChild(scrollToTopButton);

      // Define the scroll and click event listeners
      scrollListener = () => {
        if (window.scrollY > 200) {
          scrollToTopButton!.style.opacity = ".8";
          clearTimeout(hideTimeout);
          hideTimeout = setTimeout(() => {
            scrollToTopButton!.style.opacity = "0";
          }, 2000);
        }
      };

      clickListener = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      };

      // Add the event listeners
      window.addEventListener("scroll", scrollListener);
      scrollToTopButton.addEventListener("click", clickListener);
    }

    function cleanupListeners() {
      console.log("stop the thing");

      // Remove the event listeners and button if they exist
      if (scrollToTopButton) {
        window.removeEventListener("scroll", scrollListener);
        scrollToTopButton.removeEventListener("click", clickListener);
        clearTimeout(hideTimeout);
        scrollToTopButton.remove(); // Remove the button from the DOM
        scrollToTopButton = null; // Clear the reference
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
