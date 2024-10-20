// Allows the user to see a summary of suttas when hovering over a suttacentral.net link
// This content script only runs in Firefox

import setupHoverForBlurbs from "./hoverForBlurbs.content/setupHoverForBlurbs.js";

export default defineContentScript({
  include: ["firefox"],
  matches: ["<all_urls>"],
  excludeMatches: ["*://index.readingfaithfully.org/*", "*://sutta.readingfaithfully.org/*"],
  main() {
    setupHoverForBlurbs();
  },
});
