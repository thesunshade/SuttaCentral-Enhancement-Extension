import isInputFocused from "./functions/isInputFocused";

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    console.info("⏱️ Press 'h' to display reading time");

    document.addEventListener("keydown", (event: KeyboardEvent) => {
      console.log(event.key);
      if (event.key === "h" && !isInputFocused()) {
        insertReadingTime();
      }
    });

    function insertReadingTime() {
      const WPM = 200;
      const article = document.querySelector("article");

      if (!article) {
        console.warn("No article found on the page.");
        return;
      }

      const text = article.textContent;
      if (!text || !text.trim()) {
        console.warn("No text content found in the article.");
        return;
      }

      // Check if the reading time badge already exists
      if (article.querySelector(".reading-time-badge")) {
        console.info("Reading time badge already exists.");
        return;
      }

      // Calculate reading time
      const wordMatchRegExp = /[^\s]+/g; // Regular expression to match words
      const words = text.matchAll(wordMatchRegExp);
      const wordCount = [...words].length;
      const readingTime = Math.round(wordCount / WPM);

      // Create and insert the badge
      const badge = document.createElement("p");
      badge.classList.add("color-secondary-text", "type--caption", "reading-time-badge");
      badge.textContent = `⏱️ ${readingTime} min read (${WPM} wpm)`;

      // Find the location to insert the badge (after h1 or time/date)
      const heading = article.querySelector("h1");
      const date = article.querySelector("time")?.parentNode;
      ((date as HTMLElement | null) ?? (heading as HTMLElement)).insertAdjacentElement("afterend", badge);
    }
  },
});
