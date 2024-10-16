import setupHoverForBlurbs from "./hoverForBlurbs.content/setupHoverForBlurbs.js";

export default defineContentScript({
  include: ["firefox"],
  matches: ["<all_urls>"],
  excludeMatches: ["*://index.readingfaithfully.org/*", "*://sutta.readingfaithfully.org/*"],
  main() {
    setupHoverForBlurbs();
  },
});
