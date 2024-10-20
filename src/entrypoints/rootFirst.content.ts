// Swaps position of root and translation

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    let observer: MutationObserver | null = null;

    // CSS styles for side-by-side layout
    const sideBySideStyles = `
      .root {
        grid-column: 1 !important;
      }
      .translation {
        grid-column: 2 !important;
      }
    `;

    // Function to dynamically inject the side-by-side layout styles
    const addSideBySideStyles = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const layout = urlParams.get("layout");

      if (layout === "sidebyside") {
        let styleElement = document.getElementById("side-by-side-styles");
        if (!styleElement) {
          styleElement = document.createElement("style");
          styleElement.id = "side-by-side-styles";
          styleElement.textContent = sideBySideStyles;
          document.head.appendChild(styleElement);
        }
      }
    };

    // Function to remove the side-by-side layout styles
    const removeSideBySideStyles = () => {
      const styleElement = document.getElementById("side-by-side-styles");
      if (styleElement) {
        styleElement.remove();
      }
    };

    // Function to swap elements back to their original order
    const resetSwap = () => {
      const segments = Array.from(document.querySelectorAll(".segment"));
      segments.forEach(segment => {
        const translation = segment.querySelector(".translation");
        const root = segment.querySelector(".root");
        // Reset original order: translation first, root after
        if (translation && root && translation.nextSibling !== root) {
          segment.insertBefore(translation, root);
        }
      });
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

          // Swap the root before translation
          if (translation && root && root.nextSibling !== translation) {
            segment.insertBefore(root, translation);
          }
        }

        index = end;

        // If there are more segments, schedule the next batch
        if (index < segments.length) {
          requestAnimationFrame(swapBatch); // Schedule the next batch
        }
      };

      requestAnimationFrame(swapBatch); // Start the first batch
    };

    // Function to check the setting and run or clean up the script
    const checkSettingAndRun = () => {
      chrome.storage.sync.get("languageSwap", data => {
        const isEnabled = data["languageSwap"] === "true"; // Convert to boolean

        if (!isEnabled) {
          console.info("❌ Language swap is disabled");
          removeStylesAndCleanup();
        } else {
          console.info("🔀 Progressive swap of .translation and .root active");
          applyStylesAndSwap();
        }
      });
    };

    // Function to apply styles and reorder the elements
    const applyStylesAndSwap = () => {
      progressiveSwap(); // Apply the reordering
      addSideBySideStyles(); // Conditionally apply the side-by-side CSS
    };

    // Function to remove styles and reset the element order
    const removeStylesAndCleanup = () => {
      removeSideBySideStyles(); // Remove side-by-side CSS
      resetSwap(); // Reset the translation/root order

      // Disconnect the observer if it exists
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    };

    // Initial check
    checkSettingAndRun();

    // Listen for changes to the languageSwap setting
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === "sync" && changes.languageSwap) {
        checkSettingAndRun(); // Run the script if the languageSwap setting changes
      }
    });

    // Optional: Monitor dynamic content changes as a fallback
    const observeMutations = () => {
      observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            progressiveSwap(); // Re-apply swap if content is dynamically added
            addSideBySideStyles(); // Re-check layout on dynamic content change
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    };

    // Observe mutations
    observeMutations();
  },
});
