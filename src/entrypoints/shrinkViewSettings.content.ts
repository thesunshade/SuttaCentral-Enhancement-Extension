import { querySelectorDeep } from "query-selector-shadow-dom";

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    console.info("📐 shrink view menu");

    setTimeout(() => {
      const outerSetting = querySelectorDeep("#setting_menu");
      const innerSetting = querySelectorDeep("#setting_menu section");

      if (innerSetting !== null) {
        innerSetting.style.display = "inline-block";
        innerSetting.style.width = "365px";
        innerSetting.style.paddingLeft = "5px";
        innerSetting.style.paddingBottom = "15px";

        const settingsStyleElement = document.createElement("style");
        settingsStyleElement.innerHTML = `#setting_menu{
  background-color: var(--sc-inverted-text-color);

  overflow: hidden scroll;
  width: 385px;
  right: 0px;
  height: 60vh;
  padding-left: 5px;
  padding-bottom: 15px;
  position: absolute;
  border: 1px solid var(--sc-border-color);
  box-shadow: var(--sc-shadow-elevation-1dp);
  line-height: 190%;
}`;

        outerSetting.parentNode.insertBefore(settingsStyleElement, outerSetting);

        // not sure if the below does anything
        const labelsWithRadio = innerSetting.querySelectorAll("div.tools div.form-controls label:has(md-radio)");

        labelsWithRadio.forEach(label => {
          const labelElement = label as HTMLElement; // Cast to HTMLElement

          labelElement.style.display = "inline";
          labelElement.style.marginTop = "1px";
          labelElement.style.marginLeft = "0px";
          labelElement.style.marginRight = "10px";
          labelElement.style.lineHeight = "1em";
          labelElement.style.whiteSpace = "nowrap";
          // labelElement.style.marginTop = "20px";
        });

        const labelsWithCheckbox = innerSetting.querySelectorAll("div.tools div.form-controls label:has(md-checkbox)");

        labelsWithCheckbox.forEach(label => {
          const labelElement = label as HTMLElement; // Cast to HTMLElement

          labelElement.style.lineHeight = "125%";
          labelElement.style.paddingBottom = "1em";
          labelElement.style.marginTop = "0px";
          labelElement.style.marginLeft = "0px";
          labelElement.style.maxWidth = "70%";
        });

        const alphabetSelect = innerSetting.querySelector("#selPaliScripts") as HTMLElement;
        if (alphabetSelect) {
          alphabetSelect.style.width = "inherit";
        } else {
          console.error("💥 #selPaliScripts not found");
        }
        const settingsSectionTools = innerSetting.querySelectorAll(".tools");
        settingsSectionTools.forEach(element => {
          (element as HTMLElement).style.borderBottom = "1px solid var(--sc-border-color)";
          (element as HTMLElement).style.borderRight = "0";
        });
        const settingsSectionToolsfirst = innerSetting.querySelectorAll(".tools:first-of-type");
        settingsSectionTools.forEach(element => {
          (element as HTMLElement).style.borderBottom = "margin-left:0";
        });

        const paliWordLookup = innerSetting.querySelectorAll(".form-controls.four-column");
        paliWordLookup.forEach(element => {
          (element as HTMLElement).style.columnCount = "2";
        });
      }
    }, 2000);
  },
});
