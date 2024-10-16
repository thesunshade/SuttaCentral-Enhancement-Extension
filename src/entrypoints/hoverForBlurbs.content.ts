import setupHoverForBlurbs from "./hoverForBlurbs.content/setupHoverForBlurbs.js";

export default defineContentScript({
  include: ["chrome"],
  matches: ["<all_urls>"],
  registration: "runtime",
  main() {
    setupHoverForBlurbs();
  },
});
