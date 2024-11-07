// Swaps position of root and translation
// --------------------------------------
// There are two aspects to swapping.
// The first is actually reversing the position
// of the .root and .translation segments.
// This can only happen after the article element is
// finished being built.
// It also needs to happen when a new page is navigated
// to via the interface. This means that the article tag
// is removed and must be watched for again.
//
// Second is adding a style element with custom css
// for when viewing side by side. This is triggered
// by a change in the `layout` parameter in the url.
//
// TESTING
// When setting is on…
// 1. Page refresh and segments should be swapped
// 2. Navigate to a new sutta by clicking on the "next" button at the end of the sutta.
// 3. Cycle through the views. Make sure that the segments are alligned on the side by side view
// When setting is off…
// 1. Turning setting off should remove style.side-by-side-styles
// 2. All three views should look normal (i.e. not swapped)
// 3. Navigating to a new page should look normal

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    // let observer: MutationObserver | null = null;
    let layoutObserver: MutationObserver | null = null;
    let articleObserver: MutationObserver | null = null;

    // Function to check the setting and run or clean up the script
    function checkSettingAndRun() {
      chrome.storage.sync.get("languageSwap", data => {
        const isEnabled = data["languageSwap"] === "true";
        if (!isEnabled) {
          console.log("❌ Language swap is disabled");
          removeSideBySideStyles();
          resetSwap();
          // none of the below seems to do anything
          // if (observer) {
          //   observer.disconnect();
          //   observer = null;
          // }
          // if (layoutObserver) {
          //   layoutObserver.disconnect();
          //   layoutObserver = null;
          // }
          // if (articleObserver) {
          //   console.log("remove articleObserver");
          //   articleObserver.disconnect();
          //   articleObserver = null;
          // }
        } else {
          console.log("🔀 Progressive swap of .translation and .root active");
          progressiveSwap();
          addSideBySideStyles();
          observeArticleChanges();
          // Observe URL changes using MutationObserver (if applicable)
          layoutObserver = new MutationObserver(() => {
            changeLayoutStyleBasedOnParameter();
          });

          // Start observing the body for child list changes
          layoutObserver.observe(document.body, { childList: true, subtree: true });
        }
      });
    }

    // Initial check
    checkSettingAndRun();

    // Listen for changes to the languageSwap setting in the extension
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === "sync" && changes.languageSwap) {
        checkSettingAndRun();
      }
    });

    //
    // CSS MANIPULATION FOR SIDE BY SIDE LAYOUT
    //

    const sideBySideStyles = `
      .root { grid-column: 1 !important;}
      .translation {grid-column: 2 !important;}`;

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

    function changeLayoutStyleBasedOnParameter() {
      const urlParams = new URLSearchParams(window.location.search);
      const layout = urlParams.get("layout");
      // console.log("Current layout parameter:", layout);

      if (layout === "linebyline") {
        removeSideBySideStyles();
      } else if (layout === "sidebyside") {
        addSideBySideStyles();
      }
    }

    //
    // SWAPPING THE SEGMENTS AND RESTORING THEM
    //

    function progressiveSwap() {
      const segments = Array.from(document.querySelectorAll(".segment"));

      // Check if the .root element is already first in the first segment
      const firstSegment = segments[0];
      const firstTranslation = firstSegment?.querySelector(".translation");
      const firstRoot = firstSegment?.querySelector(".root");

      if (firstTranslation && firstRoot && firstRoot.nextSibling === firstTranslation) {
        // If root is already correctly positioned in the first segment, exit early
        return;
      }

      const batchSize = 50;
      let index = 0;

      function swapBatch() {
        const end = Math.min(index + batchSize, segments.length);
        for (let i = index; i < end; i++) {
          const segment = segments[i];
          const translation = segment.querySelector(".translation");
          const root = segment.querySelector(".root");

          // Swap the root before translation if needed
          if (translation && root && root.nextSibling !== translation) {
            segment.insertBefore(root, translation);
          }
        }

        index = end;

        // If there are more segments, schedule the next batch
        if (index < segments.length) {
          requestAnimationFrame(swapBatch);
        }
      }

      requestAnimationFrame(swapBatch);
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

    // Helper function for debouncing
    function debounce(func: () => void, delay: number) {
      let timerId: number | undefined;
      return () => {
        clearTimeout(timerId);
        timerId = window.setTimeout(() => func(), delay);
      };
    }

    // Function to run after the `article` content is stable
    function applyArticleChanges() {
      // console.log("Applying changes to the article content.");
      progressiveSwap();
      addSideBySideStyles();
    }

    // Debounced version of the apply function
    const debouncedApplyChanges = debounce(applyArticleChanges, 500);

    // Function to observe changes to the `article` element
    function observeArticleChanges() {
      articleObserver = new MutationObserver(mutationsList => {
        const article = document.querySelector("article");

        if (article) {
          // Start observing changes within the `article` element
          const innerObserver = new MutationObserver(debouncedApplyChanges);
          innerObserver.observe(article, {
            childList: true,
            subtree: true,
            characterData: true,
          });

          // If the article is removed, disconnect the inner observer
          mutationsList.forEach(mutation => {
            if (mutation.removedNodes.length) {
              mutation.removedNodes.forEach(node => {
                if (node instanceof HTMLElement && node.tagName === "ARTICLE") {
                  innerObserver.disconnect();
                }
              });
            }
          });
        }
      });

      // Start observing the body for changes to find the `article` element
      articleObserver.observe(document.body, { childList: true, subtree: true });
    }
  },
});
