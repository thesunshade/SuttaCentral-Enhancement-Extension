export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main: () => {
    const updateLayoutClass = () => {
      const layout = new URLSearchParams(window.location.search).get('layout');
      document.body.classList.toggle('sidebyside-layout', layout === 'sidebyside');
    };

    const toggleLanguageSwapClass = () => {
      chrome.storage.sync.get("languageSwap", ({ languageSwap }) => {
        document.body.classList.toggle("language-swap-active", languageSwap === "true");
      });
    };

    updateLayoutClass();
    toggleLanguageSwapClass();

    const observer = new MutationObserver(updateLayoutClass);
    observer.observe(document.body, { childList: true, subtree: true });

    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === "sync" && changes.languageSwap) {
        toggleLanguageSwapClass();
      }
    });
  },
});
