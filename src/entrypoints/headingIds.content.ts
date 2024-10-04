export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    function displayHeadingIds() {
      console.info("👁️ IDs displayed for headers if main refs turned on");
    }
    displayHeadingIds();

    const styleTag = document.createElement("style");

    styleTag.textContent = `
  body{
 h2 .reference, h3 .reference, h4 .reference, h5 .reference{
    display:inline
}

  }
  `;
    document.head.appendChild(styleTag);
  },
});
