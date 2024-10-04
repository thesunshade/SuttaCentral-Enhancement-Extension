export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    function changeColors() {
      console.log("🎨 Theme: Burglar");
    }
    changeColors();

    const styleTag = document.createElement("style");

    styleTag.textContent = `

body{
--scrollbar-width: 17px!important;
--sc-primary-color: #666!important;
--sc-primary-color-light: #858585!important;
--sc-primary-color-light-transparent: #85858566!important;
--sc-primary-color-dark: #525252!important;
--sc-primary-accent-color: #000!important;
--sc-primary-accent-color-light: #5aa8f2!important;
--sc-secondary-accent-color: #C03030!important;
--sc-secondary-accent-color-light: #CC5959!important;
--sc-primary-background-color: #fafafa!important;
--sc-on-primary-primary-text-color: #201b13!important;
--sc-on-primary-secondary-text-color: #7c766f!important;
--sc-secondary-background-color: #fffbff!important;
--sc-on-secondary-primary-text-color: #211400!important;
--sc-on-secondary-secondary-text-color: #807567!important;
--sc-tertiary-background-color: #ebebeb!important;
--sc-on-tertiary-primary-text-color: #00192f!important;
--sc-on-tertiary-secondary-text-color: #675d4f!important;
--sc-dark-fixed-background-color: #544f4f!important;
--sc-darker-fixed-background-color: #000000!important;
}
`;
    document.head.appendChild(styleTag);
  },
});

// Grimace
// --sc-primary-color: #9f05c6!important;
//   --sc-primary-color-light: #ca10f9!important;
//   --sc-primary-color-light-transparent: #ca10f966!important;
//   --sc-primary-color-dark: hsl(288 95% 32% / 1)!important;
//   --sc-primary-accent-color: #c18b49!important;
//   --sc-primary-accent-color-light: hsl(33 85% 65% / 1)!important;
//   --sc-secondary-accent-color: #C03030!important;
//   --sc-secondary-accent-color-light: #CC5959!important;
//   --sc-primary-background-color: #fdf5ff!important;
//   --sc-on-primary-primary-text-color: #201b13!important;
//   --sc-on-primary-secondary-text-color: #7c766f!important;
//   --sc-secondary-background-color: #fffbff!important;
//   --sc-on-secondary-primary-text-color: #211400!important;
//   --sc-on-secondary-secondary-text-color: #807567!important;
//   --sc-tertiary-background-color: hsl(288 65% 92% / 1)!important;

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
// --sc-primary-color: #c60577!important;
// --sc-primary-color-light: #f9109c!important;
// --sc-primary-color-light-transparent: #f9109c66!important;
// --sc-primary-color-dark: hsl(324 95% 32% / 1)!important;
// --sc-primary-accent-color: #48c1b1!important;
// --sc-primary-accent-color-light: #5af2dd!important;
// --sc-secondary-accent-color: #C03030!important;
// --sc-secondary-accent-color-light: #CC5959!important;
// --sc-primary-background-color: #fff5fb!important;
// --sc-on-primary-primary-text-color: #201b13!important;
// --sc-on-primary-secondary-text-color: #7c766f!important;
// --sc-secondary-background-color: hsl(0deg 0% 99.22%)!important;
// --sc-on-secondary-primary-text-color: #211400!important;
// --sc-on-secondary-secondary-text-color: #807567!important;
// --sc-tertiary-background-color: #f8dded!important;
// --sc-on-tertiary-primary-text-color: #00192f!important;
// --sc-on-tertiary-secondary-text-color: #675d4f!important;
// --sc-dark-fixed-background-color: #544f4f!important;
// --sc-darker-fixed-background-color: #3a3036!important;

// hamburgler
// this is not pure black: --sc-dark-fixed-background-color: #544f4f!important;
// --scrollbar-width: 17px!important;
// --sc-primary-color: #666!important;
// --sc-primary-color-light: #858585!important;
// --sc-primary-color-light-transparent: #85858566!important;
// --sc-primary-color-dark: #525252!important;
// --sc-primary-accent-color: #000!important;
// --sc-primary-accent-color-light: #5aa8f2!important;
// --sc-secondary-accent-color: #C03030!important;
// --sc-secondary-accent-color-light: #CC5959!important;
// --sc-primary-background-color: #fafafa!important;
// --sc-on-primary-primary-text-color: #201b13!important;
// --sc-on-primary-secondary-text-color: #7c766f!important;
// --sc-secondary-background-color: #fffbff!important;
// --sc-on-secondary-primary-text-color: #211400!important;
// --sc-on-secondary-secondary-text-color: #807567!important;
// --sc-tertiary-background-color: #ebebeb!important;
// --sc-on-tertiary-primary-text-color: #00192f!important;
// --sc-on-tertiary-secondary-text-color: #675d4f!important;
// --sc-dark-fixed-background-color: #544f4f!important;
// --sc-darker-fixed-background-color: #000000!important;

// ronald
// --sc-primary-color: #c60505!important;
// --sc-primary-color-light: #f91010!important;
// --sc-primary-color-light-transparent: #f9101066!important;
// --sc-primary-color-dark: #9f0404!important;
// --sc-primary-accent-color: #ffba63!important;
// --sc-primary-accent-color-light: #ca9c64!important;
// --sc-secondary-accent-color: #C03030!important;
// --sc-secondary-accent-color-light: #CC5959!important;
// --sc-primary-background-color: #fff5f5!important;
// --sc-on-primary-primary-text-color: #201b13!important;
// --sc-on-primary-secondary-text-color: #7c6e6e!important;
// --sc-secondary-background-color: #fffbff!important;
// --sc-on-secondary-primary-text-color: #211400!important;
// --sc-on-secondary-secondary-text-color: #807567!important;
// --sc-tertiary-background-color: #f8dddd!important;
// --sc-on-tertiary-primary-text-color: #00192f!important;
// --sc-on-tertiary-secondary-text-color: #675d4f!important;
// --sc-dark-fixed-background-color: #544f4f!important;
// --sc-darker-fixed-background-color: #403c3c!important;

//OBM
// --sc-primary-color: #0528c6!important;
//   --sc-primary-color-light: #103bf9!important;
//   --sc-primary-color-light-transparent: #103bf966!important;
//   --sc-primary-color-dark: #04219f!important;
//   --sc-primary-accent-color: #ffba63!important;
//   --sc-primary-accent-color-light: #ffd49f!important;
//   --sc-secondary-accent-color: #C03030!important;
//   --sc-secondary-accent-color-light: #CC5959!important;
//   --sc-primary-background-color: #f5f7ff!important;
//   --sc-on-primary-primary-text-color: #201b13!important;
//   --sc-on-primary-secondary-text-color: #7c766f!important;
//   --sc-secondary-background-color: #fffbff!important;
//   --sc-on-secondary-primary-text-color: #211400!important;
//   --sc-on-secondary-secondary-text-color: #807567!important;
//   --sc-tertiary-background-color: #dde2f8!important;
//   --sc-on-tertiary-primary-text-color: #00192f!important;
//   --sc-on-tertiary-secondary-text-color: #675d4f!important;
//   --sc-dark-fixed-background-color: #544f4f!important;
//   --sc-darker-fixed-background-color: #383b47!important;

//----------------------------------

// shamrock shake Dark
// --scrollbar-width: 17px;
//     --sc-primary-color: hsl(120deg 99% 25.32%);
//     --sc-primary-color-light: hsl(120deg 85.35% 37.22%);
//     --sc-primary-color-light-transparent: hsl(120deg 94% 79% / 20%);
//     --sc-primary-color-dark: hsl(120 95% 32% / 1);
//     --sc-primary-accent-color: #5aa8f2;
//     --sc-primary-accent-color-light: #4886C1;
//     --sc-secondary-accent-color: #C03030;
//     --sc-secondary-accent-color-light: #CC5959;
//     --sc-primary-background-color: #414141;
//     --sc-on-primary-primary-text-color: #eeeeee;
//     --sc-on-primary-secondary-text-color: #cccccc;
//     --sc-secondary-background-color: #515151;
//     --sc-on-secondary-primary-text-color: #efefef;
//     --sc-on-secondary-secondary-text-color: #cdcdcd;
//     --sc-tertiary-background-color: #616161;
//     --sc-on-tertiary-primary-text-color: #ffffff;
//     --sc-on-tertiary-secondary-text-color: #dddddd;
//     --sc-dark-fixed-background-color: #515151;
//     --sc-darker-fixed-background-color: hsl(120deg 88.06% 6.36%);

// =========================================================

// bubblegum
// --scrollbar-width: 17px;
// --sc-primary-color: #05bdc6;
// --sc-primary-color-light: #7bf9ff;
// --sc-primary-color-light-transparent: rgb(15 243 249 / 40%);
// --sc-primary-color-dark: #f1319a;
// --sc-primary-accent-color: #4886C1;
// --sc-primary-accent-color-light: #5aa8f2;
// --sc-secondary-accent-color: #C03030;
// --sc-secondary-accent-color-light: #CC5959;
// --sc-primary-background-color: #f3ffff;
// --sc-on-primary-primary-text-color: #201b13;
// --sc-on-primary-secondary-text-color: #7c766f;
// --sc-secondary-background-color: #ffeef8;
// --sc-on-secondary-primary-text-color: #211400;
// --sc-on-secondary-secondary-text-color: #807567;
// --sc-tertiary-background-color: #def7f8;
// --sc-on-tertiary-primary-text-color: #00192f;
// --sc-on-tertiary-secondary-text-color: #675d4f;
// --sc-dark-fixed-background-color: #544f4f;
// --sc-darker-fixed-background-color: #003a3b;

// sonora
// --scrollbar-width: 17px;
//     --sc-primary-color: #FF9800;
//     --sc-primary-color-light: #B80000;
//     --sc-primary-color-light-transparent: #5f86706e;
//     --sc-primary-color-dark: #5F8670;
//     --sc-primary-accent-color: #4886C1;
//     --sc-primary-accent-color-light: #5aa8f2;
//     --sc-secondary-accent-color: #C03030;
//     --sc-secondary-accent-color-light: #CC5959;
//     --sc-primary-background-color: #fff8f3;
//     --sc-on-primary-primary-text-color: #201b13;
//     --sc-on-primary-secondary-text-color: #7c766f;
//     --sc-secondary-background-color: #fffbff;
//     --sc-on-secondary-primary-text-color: #211400;
//     --sc-on-secondary-secondary-text-color: #807567;
//     --sc-tertiary-background-color: #d0e8db;
//     --sc-on-tertiary-primary-text-color: #00192f;
//     --sc-on-tertiary-secondary-text-color: #675d4f;
//     --sc-dark-fixed-background-color: #544f4f;
//     --sc-darker-fixed-background-color: #820300;

// pumpkin spice
// --scrollbar-width: 17px;
// --sc-primary-color: #c65e05;
// --sc-primary-color-light: hsl(28 95% 52% / 1);
// --sc-primary-color-light-transparent: rgb(249 125 16 / 40%);
// --sc-primary-color-dark: hwb(28deg 1.6% 37.6%);
// --sc-primary-accent-color: #c40000;
// --sc-primary-accent-color-light: #ff6e6e;
// --sc-secondary-accent-color: #C03030;
// --sc-secondary-accent-color-light: #CC5959;
// --sc-primary-background-color: #fff8f3;
// --sc-on-primary-primary-text-color: #201b13;
// --sc-on-primary-secondary-text-color: #7c766f;
// --sc-secondary-background-color: #fffbff;
// --sc-on-secondary-primary-text-color: #211400;
// --sc-on-secondary-secondary-text-color: #807567;
// --sc-tertiary-background-color: hsl(28 65% 92% / 1);
// --sc-on-tertiary-primary-text-color: #00192f;
// --sc-on-tertiary-secondary-text-color: #675d4f;
// --sc-dark-fixed-background-color: #544f4f;
// --sc-darker-fixed-background-color: hsl(28deg 100% 9.29%);

// https://github.com/suttacentral/bilara/blob/master/client/src/styles/themes.js
