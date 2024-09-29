export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    function changeColors() {
      console.info("🎨 Theme: Shamrock Shake");
    }
    changeColors();

    const styleTag = document.createElement("style");

    styleTag.textContent = `
body{
  --sc-primary-color: #00a600!important;
  --sc-primary-color-light: #00f200!important;
  --sc-primary-color-light-transparent: rgba(0, 204, 0, 0.4)!important;
  --sc-primary-color-dark: #004d00!important;
  --sc-primary-background-color: #f3fff3!important;
  --sc-darker-fixed-background-color: #2e3a2f!important;
  --sc-tertiary-background-color: #e9f8de!important;
  --sc-on-tertiary-secondary-text-color: #435540!important;
  --sc-primary-accent-color: #c14848!important;
  --sc-primary-accent-color-light: #f25a5a!important;
  --sc-secondary-accent-color: #c07330!important;
  --sc-secondary-accent-color-light: #ccb359!important;
  --sc-dark-fixed-background-color: #4f5452!important;
}
`;
    document.head.appendChild(styleTag);
  },
});
