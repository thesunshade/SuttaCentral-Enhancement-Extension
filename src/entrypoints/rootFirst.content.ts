export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main: () => {
    const toggleClass = (className: string, classActive: boolean) => {
      document.body.classList.toggle(className, classActive);
    };

    const updateLayoutClass = () => {
      const currentLayout = new URLSearchParams(window.location.search).get("layout");
      const layoutClasses = {
        linebyline: "linebyline-layout",
        sidebyside: "sidebyside-layout"
      };

      Object.keys(layoutClasses).forEach(layout => {
        toggleClass(layoutClasses[layout], currentLayout === layout);
      });
    };

    const reorderDOM = (swapEnabled: boolean) => {
      document.querySelectorAll(".segment").forEach(segment => {
        const root = segment.querySelector(".root");
        const translation = segment.querySelector(".translation");
        if (!root || !translation) return;

        const firstElement = swapEnabled ? root : translation;
        const secondElement = swapEnabled ? translation : root;
        if (segment.firstChild !== firstElement) {
          segment.insertBefore(firstElement, secondElement);
        }
      });
    };

    const updateLanguageSwapClass = async () => {
      const { languageSwap } = await chrome.storage.sync.get("languageSwap");
      const swapEnabled = languageSwap === "true";
      toggleClass("language-swap-active", swapEnabled);
      reorderDOM(swapEnabled);
    };

    const initializeObservers = () => {
      const observer = new MutationObserver(() => {
        updateLayoutClass();
        updateLanguageSwapClass();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      return observer;
    };

    const initialize = () => {
      updateLayoutClass();
      updateLanguageSwapClass();
      initializeObservers();
      chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === "sync" && changes.languageSwap) {
          updateLanguageSwapClass();
        }
      });
    };

    document.addEventListener("DOMContentLoaded", initialize);
  },
});
