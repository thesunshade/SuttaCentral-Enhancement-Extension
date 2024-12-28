export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    interface Difficulty {
      level: number;
      name: string;
    }

    const featureEnabled = async (article) => {
      const { showDifficultyLevel } = await chrome.storage.sync.get("showDifficultyLevel");
      if (showDifficultyLevel === "true") {
        return insertDifficulty(article);
      }
      removeDifficultyContainer();
    };

    chrome.storage.onChanged.addListener(featureEnabled);

    document.addEventListener("DOMContentLoaded", () => {
      new MutationObserver(() => {
        const article = document.querySelector("article");
        if (article) featureEnabled(article);
      }).observe(document.body, { childList: true, subtree: true });
    });

    const removeDifficultyContainer = () => {
      document.querySelector(".difficulty-container")?.remove();
    };

    const createDifficultyContainer = ({ level, name }: Difficulty): HTMLDivElement => {
      const container = document.createElement("div");
      container.classList.add("difficulty-container");

      const barsWrapper = document.createElement("div");
      barsWrapper.classList.add("difficulty-bars");
      barsWrapper.append(...createDifficultyBars(level));

      const textElement = document.createElement("p");
      textElement.classList.add("difficulty-text");
      textElement.textContent = name;

      container.append(barsWrapper, textElement);
      return container;
    };

    const createDifficultyBars = (level: number): HTMLSpanElement[] => {
      return Array.from({ length: 3 }, (_, barIndex) => {
        const bar = document.createElement("span");
        bar.classList.add("difficulty-bar");
        barIndex < level && bar.classList.add("active");
        return bar;
      });
    };

    const insertDifficulty = (article: HTMLElement) => {
      chrome.storage.local.get("suttaData", ({ suttaData }) => {
        const { difficulty } = suttaData ?? {};
        const existingDifficulty = document.querySelector(".difficulty-text");
        if (!difficulty || existingDifficulty) return;
        const difficultyContainer = createDifficultyContainer(difficulty);
        const target = document.querySelector(".reading-time-badge") ?? article.querySelector("h1");
        target?.insertAdjacentElement("afterend", difficultyContainer);
      });
    };

  },
});
