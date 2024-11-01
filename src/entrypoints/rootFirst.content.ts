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

    function addSideBySideStyles() {
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
    }

    function removeSideBySideStyles() {
      const styleElement = document.getElementById("side-by-side-styles");
      if (styleElement) {
        styleElement.remove();
      }
    }

    function resetSwap() {
      const segments = Array.from(document.querySelectorAll(".segment"));
      segments.forEach(segment => {
        const translation = segment.querySelector(".translation");
        const root = segment.querySelector(".root");
        // Reset original order: translation first, root after
        if (translation && root && translation.nextSibling !== root) {
          segment.insertBefore(translation, root);
        }
      });
    }

    function progressiveSwap() {
      const segments = Array.from(document.querySelectorAll(".segment"));
      const batchSize = 50;
      let index = 0;

      function swapBatch() {
        const end = Math.min(index + batchSize, segments.length);
        console.log(end);
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
      }

      requestAnimationFrame(swapBatch); // Start the first batch
    }

    // Function to check the setting and run or clean up the script
    function checkSettingAndRun() {
      chrome.storage.sync.get("languageSwap", data => {
        const isEnabled = data["languageSwap"] === "true";
        if (!isEnabled) {
          console.log("❌ Language swap is disabled");
          removeSideBySideStyles();
          resetSwap();
          if (observer) {
            observer.disconnect();
            observer = null;
          }
        } else {
          console.log("🔀 Progressive swap of .translation and .root active");
          progressiveSwap();
          addSideBySideStyles();
        }
      });
    }

    // Initial check
    checkSettingAndRun();

    // Listen for changes to the languageSwap setting
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === "sync" && changes.languageSwap) {
        checkSettingAndRun();
      }
    });
  },
});
