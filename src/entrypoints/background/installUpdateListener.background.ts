export default defineBackground(() => {
  // this only runs when in production
  chrome.runtime.onInstalled.addListener(function (object) {
    let installUrl = chrome.runtime.getURL("extension-pages/welcome.html");

    if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
      chrome.tabs.create({ url: installUrl }, function (tab) {});
    }
    if (object.reason === chrome.runtime.OnInstalledReason.UPDATE && import.meta.env.MODE === "production") {
      chrome.tabs.create({ url: installUrl }, function (tab) {});
    }
  });
});
