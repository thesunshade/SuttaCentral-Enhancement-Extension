import { querySelectorDeep } from "query-selector-shadow-dom";

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    console.info("📐 shrink view menu");

    setTimeout(() => {
      const innerSetting = querySelectorDeep("#setting_menu section");

      innerSetting.style.display = "inherit";
      innerSetting.style.overflowY = "scroll";
      innerSetting.style.height = "60vh";

      const labelsWithRadio = innerSetting.querySelectorAll("div.tools div.form-controls label:has(md-radio)");
      labelsWithRadio.forEach(label => {
        label.style.display = "inline";
        label.style.marginTop = "2px";
      });

      const alphabetSelect = innerSetting.querySelector("#selPaliScripts");
      alphabetSelect.style.width = "inherit";

      const paliWordLookup = innerSetting.querySelectorAll(".form-controls.two-column");
      paliWordLookup.forEach(element => {
        element.style.columnCount = "1";
      });
    }, 2000);
  },
});
