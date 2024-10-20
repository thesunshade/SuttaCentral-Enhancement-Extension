// Allows the user to see a summary of suttas when hovering over a suttacentral.net link
// This content script only runs in Chrome

import setupHoverForBlurbs from "./hoverForBlurbs.content/setupHoverForBlurbs.js";

export default defineContentScript({
  include: ["chrome"],
  matches: ["<all_urls>"],
  registration: "runtime",
  main() {
    setupHoverForBlurbs();
  },
});
