export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    function changeColors() {
      console.info("🎨 Theme: Grimace");
    }
    changeColors();

    const styleTag = document.createElement("style");

    styleTag.textContent = `
body{
--sc-primary-color: #9f05c6!important;
  --sc-primary-color-light: #ca10f9!important;
  --sc-primary-color-light-transparent: #ca10f966!important;
  --sc-primary-color-dark: hsl(288 95% 32% / 1)!important;
  --sc-primary-accent-color: #c18b49!important;
  --sc-primary-accent-color-light: hsl(33 85% 65% / 1)!important;
  --sc-secondary-accent-color: #C03030!important;
  --sc-secondary-accent-color-light: #CC5959!important;
  --sc-primary-background-color: #fdf5ff!important;
  --sc-on-primary-primary-text-color: #201b13!important;
  --sc-on-primary-secondary-text-color: #7c766f!important;
  --sc-secondary-background-color: #fffbff!important;
  --sc-on-secondary-primary-text-color: #211400!important;
  --sc-on-secondary-secondary-text-color: #807567!important;
  --sc-tertiary-background-color: hsl(288 65% 92% / 1)!important;
}
`;
    document.head.appendChild(styleTag);
  },
});

// Shamrock shake
// body{
//   --sc-primary-color: #00a600!important;
//   --sc-primary-color-light: #00f200!important;
//   --sc-primary-color-light-transparent: rgba(0, 204, 0, 0.4)!important;
//   --sc-primary-color-dark: #004d00!important;
//   --sc-primary-background-color: #f3fff3!important;
//   --sc-darker-fixed-background-color: #2e3a2f!important;
//   --sc-tertiary-background-color: #e9f8de!important;
//   --sc-on-tertiary-secondary-text-color: #435540!important;
//   --sc-primary-accent-color: #c14848!important;
//   --sc-primary-accent-color-light: #f25a5a!important;
//   --sc-secondary-accent-color: #c07330!important;
//   --sc-secondary-accent-color-light: #ccb359!important;
//   --sc-dark-fixed-background-color: #4f5452!important;
// }

// birdie
// --sc-primary-color: #c60577;
// --sc-primary-color-light: #f9109c;
// --sc-primary-color-light-transparent: #f9109c66;
// --sc-primary-color-dark: hsl(324 95% 32% / 1);
// --sc-primary-accent-color: #48c1b1;
// --sc-primary-accent-color-light: #5af2dd;
// --sc-secondary-accent-color: #C03030;
// --sc-secondary-accent-color-light: #CC5959;
// --sc-primary-background-color: #fff5fb;
// --sc-on-primary-primary-text-color: #201b13;
// --sc-on-primary-secondary-text-color: #7c766f;
// --sc-secondary-background-color: hsl(0deg 0% 99.22%);
// --sc-on-secondary-primary-text-color: #211400;
// --sc-on-secondary-secondary-text-color: #807567;
// --sc-tertiary-background-color: #f8dded;
// --sc-on-tertiary-primary-text-color: #00192f;
// --sc-on-tertiary-secondary-text-color: #675d4f;
// --sc-dark-fixed-background-color: #544f4f;
// --sc-darker-fixed-background-color: #3a3036;

// hamburgler
// --scrollbar-width: 17px;
// --sc-primary-color: #666;
// --sc-primary-color-light: #858585;
// --sc-primary-color-light-transparent: #85858566;
// --sc-primary-color-dark: #525252;
// --sc-primary-accent-color: #000;
// --sc-primary-accent-color-light: #5aa8f2;
// --sc-secondary-accent-color: #C03030;
// --sc-secondary-accent-color-light: #CC5959;
// --sc-primary-background-color: #fafafa;
// --sc-on-primary-primary-text-color: #201b13;
// --sc-on-primary-secondary-text-color: #7c766f;
// --sc-secondary-background-color: #fffbff;
// --sc-on-secondary-primary-text-color: #211400;
// --sc-on-secondary-secondary-text-color: #807567;
// --sc-tertiary-background-color: #ebebeb;
// --sc-on-tertiary-primary-text-color: #00192f;
// --sc-on-tertiary-secondary-text-color: #675d4f;
// --sc-dark-fixed-background-color: #544f4f;
// --sc-darker-fixed-background-color: #000000;

// ronald
// --sc-primary-color: #c60505;
// --sc-primary-color-light: #f91010;
// --sc-primary-color-light-transparent: #f9101066;
// --sc-primary-color-dark: #9f0404;
// --sc-primary-accent-color: #ffba63;
// --sc-primary-accent-color-light: #ffd39c;
// --sc-secondary-accent-color: #C03030;
// --sc-secondary-accent-color-light: #CC5959;
// --sc-primary-background-color: #fff5f5;
// --sc-on-primary-primary-text-color: #201b13;
// --sc-on-primary-secondary-text-color: #7c6e6e;
// --sc-secondary-background-color: #fffbff;
// --sc-on-secondary-primary-text-color: #211400;
// --sc-on-secondary-secondary-text-color: #807567;
// --sc-tertiary-background-color: #f8dddd;
// --sc-on-tertiary-primary-text-color: #00192f;
// --sc-on-tertiary-secondary-text-color: #675d4f;
// --sc-dark-fixed-background-color: #544f4f;
// --sc-darker-fixed-background-color: #403c3c;

//OBM
// --sc-primary-color: #0528c6;
//   --sc-primary-color-light: #103bf9;
//   --sc-primary-color-light-transparent: #103bf966;
//   --sc-primary-color-dark: #04219f;
//   --sc-primary-accent-color: #ffba63;
//   --sc-primary-accent-color-light: #ffd49f;
//   --sc-secondary-accent-color: #C03030;
//   --sc-secondary-accent-color-light: #CC5959;
//   --sc-primary-background-color: #f5f7ff;
//   --sc-on-primary-primary-text-color: #201b13;
//   --sc-on-primary-secondary-text-color: #7c766f;
//   --sc-secondary-background-color: #fffbff;
//   --sc-on-secondary-primary-text-color: #211400;
//   --sc-on-secondary-secondary-text-color: #807567;
//   --sc-tertiary-background-color: #dde2f8;
//   --sc-on-tertiary-primary-text-color: #00192f;
//   --sc-on-tertiary-secondary-text-color: #675d4f;
//   --sc-dark-fixed-background-color: #544f4f;
//   --sc-darker-fixed-background-color: #383b47;
