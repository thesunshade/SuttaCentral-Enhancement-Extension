export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    // Check the setting before running the script
    chrome.storage.sync.get("languageSwap", data => {
      const isEnabled = data["languageSwap"] === "true"; // Convert to boolean

      if (!isEnabled) {
        console.info("❌ Language swap is disabled");
        return; // Exit if the setting is not enabled
      }

      console.info("🔀 Progressive swap of .translation and .root active");

      // CSS styles for side-by-side layout
      const sideBySideStyles = `
        .root {
          grid-column: 1 !important;
        }
        .translation {
          grid-column: 2 !important;
        }
      `;

      // Function to dynamically inject or remove the side-by-side layout styles
      const handleLayoutChange = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const layout = urlParams.get("layout");
        const styleElement = document.getElementById("side-by-side-styles");

        if (layout === "sidebyside") {
          if (!styleElement) {
            const style = document.createElement("style");
            style.id = "side-by-side-styles";
            style.textContent = sideBySideStyles;
            document.head.appendChild(style);
            // console.log("Side-by-side layout CSS added.");
          }
        } else {
          if (styleElement) {
            styleElement.remove();
            // console.log("Side-by-side layout CSS removed.");
          }
        }
      };

      // Swap function that handles elements in batches
      const progressiveSwap = () => {
        const segments = Array.from(document.querySelectorAll(".segment"));
        const batchSize = 50; // Number of segments to process per frame
        let index = 0;

        const swapBatch = () => {
          const end = Math.min(index + batchSize, segments.length);
          for (let i = index; i < end; i++) {
            const segment = segments[i];
            const translation = segment.querySelector(".translation");
            const root = segment.querySelector(".root");

            if (translation && root && root.nextSibling !== translation) {
              segment.insertBefore(root, translation);
            }
          }

          index = end;

          // If there are more segments, schedule the next batch
          if (index < segments.length) {
            requestAnimationFrame(swapBatch); // Schedule the next batch
          } else {
            // console.log("All .segment swaps completed.");
          }
        };

        requestAnimationFrame(swapBatch); // Start the first batch
      };

      // Function to detect navigation changes
      const onNavigation = () => {
        // console.log("Page navigation detected, applying progressive swap and checking layout...");
        const mainElement = document.querySelector("main");

        if (mainElement) {
          progressiveSwap(); // Progressive swap
          handleLayoutChange(); // Check for layout=sidebyside and apply styles
        }
      };

      // Initial load
      onNavigation();

      // Intercept URL changes in the SPA
      const interceptHistory = () => {
        const originalPushState = history.pushState;
        history.pushState = function (data: any, unused: string, url?: string | URL | null) {
          originalPushState.apply(this, [data, unused, url]); // Use spread array for arguments
          setTimeout(onNavigation, 500); // Delay to ensure content is loaded
        };

        window.addEventListener("popstate", () => {
          setTimeout(onNavigation, 500); // For back/forward navigation
        });
      };

      // Start intercepting history changes
      interceptHistory();

      // Optional: Monitor dynamic content changes as a fallback
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            progressiveSwap(); // Re-apply swap if content is dynamically added
            handleLayoutChange(); // Re-check layout on dynamic content change
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  },
});
