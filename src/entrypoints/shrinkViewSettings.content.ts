import { querySelectorDeep } from "query-selector-shadow-dom";

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    console.info("📐 shrink view menu");

    function shrinkViewPannel() {
      setTimeout(() => {
        const outerSetting = querySelectorDeep("#setting_menu");
        const innerSetting = querySelectorDeep("#setting_menu section");

        if (innerSetting !== null) {
          const outerSettingsStyleElement = document.createElement("style");
          outerSettingsStyleElement.id = "outer-view-interface-changes";
          outerSettingsStyleElement.innerHTML = `
              #setting_menu{
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
          if (outerSetting?.parentNode !== null && outerSetting !== null) {
            outerSetting.parentNode.insertBefore(outerSettingsStyleElement, outerSetting);
          }

          const innerSettingsStyleElement = document.createElement("style");
          innerSettingsStyleElement.id = "inner-view-interface-changes";
          innerSettingsStyleElement.innerHTML = `
              section {
              display:inline-block!important; 
              width:365px;
              padding-left:5px;
              padding-bottom:15px
              }
              div.form-controls label:has(md-radio){
              display: inline;
              margin-top: 1px;
              margin-left: 0px;
              margin-right: 10px;
              line-height: 1em;
              white-space: nowrap;
              margin-top: 20px;
              }
              div.form-controls label:has(md-checkbox){
              line-height:125%;
              padding-bottom:1em;
              margin-top:0px;
              margin-left:0px;
              maxWidth:70%;
              }
              .tools{
              border-bottom:1px solid var(--sc-border-color);
              border-right: 0;
              }
              .tools:first-of-type {
              border-bottom: 0
              }
              .form-controls.four-column{
              column-count: 2
              }
              `;
          if (innerSetting?.parentNode !== null && innerSetting !== null) {
            innerSetting.parentNode.insertBefore(innerSettingsStyleElement, innerSetting);
          }
        }
      }, 2000);
    }

    function restoreViewPannel() {
      const innerViewInterfaceChangesStyle = querySelectorDeep("inner-view-interface-changes");
      const outerViewInterfaceChangesStyle = querySelectorDeep("outer-view-interface-changes");

      innerViewInterfaceChangesStyle?.remove();
      outerViewInterfaceChangesStyle?.remove();
    }

    chrome.storage.sync.get("viewOptionsShrink", result => {
      if (result.viewOptionsShrink === "true") {
        shrinkViewPannel();
      } else {
        restoreViewPannel();
      }
    });

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "sync" && changes.viewOptionsShrink) {
        if (changes.viewOptionsShrink.newValue === "true") {
          shrinkViewPannel();
        } else {
          restoreViewPannel();
        }
      }
    });
  },
});
