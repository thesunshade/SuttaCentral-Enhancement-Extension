export const settingsConfig = {
  theme: {
    label: "Theme",
    type: "select",
    choices: ["none", "Grimace", "Shamrock Shake", "Birdie", "Burglar", "Ronnie", "OB Mack", "Shamrock Shake Dark", "Bubblegum", "Sonora", "Pumpkin Spice"],
    default: "none",
  },
  randomLink: {
    label: "Add link to random sutta on home page",
    type: "checkbox",
    default: "true",
  },
  languageSwap: {
    label: "Root language appears first or on the left",
    type: "checkbox",
    default: "true",
  },
  notifyAdditionalTranslation: {
    label: "Notification of <strong>additional translations</strong> in user's language",
    type: "checkbox",
    default: "true",
  },
  notifyPaliParallels: {
    label: "Notification of <strong>Pāli parallels</strong>",
    type: "checkbox",
    default: "true",
  },
  clickSegmentNumbersToCopyUrl: {
    label: "Clicking segment number copies URL to that segment to the clipboard.",
    type: "checkbox",
    default: "true",
  },
  copyWholeText: {
    label: "<kbd>c</kbd> <strong>copies the heading and body of the entire text</strong> to the clipboard. Visible root and notes (even on asterisks) will get copied too.",
    type: "checkbox",
    default: "true",
  },
  copyBareLink: {
    label: "<kbd>u</kbd> to copy the bare url",
    type: "checkbox",
    default: "true",
  },
  copyMarkdownLink: {
    label: "<kbd>l</kbd> to copy a link to the current page in <strong>markdown format</strong>",
    type: "checkbox",
    default: "true",
  },
  qrCode: {
    label: "<kbd>q</kbd> to open a popup with a <strong>QR Code</strong>",
    type: "checkbox",
    default: "true",
  },
  selectOnlyTranslation: {
    label: "<kbd>.</kbd> to <strong>select only translation</strong>",
    type: "checkbox",
    default: "true",
  },
  selectOnlyRoot: {
    label: "<kbd>,</kbd> to <strong>select only root</strong> language",
    type: "checkbox",
    default: "true",
  },
  showUserLanguage: {
    label: "Show current site language above the three dot menu icon",
    type: "checkbox",
    default: "true",
  },
  showReadingTime: {
    label: "Show reading time",
    type: "checkbox",
    default: "true",
  },
  wordsPerMinute: {
    label: "Words Per Minute to calculate reading time",
    type: "select",
    choices: ["100", "150", "200", "250", "300", "350", "400", "450"],
    default: "200",
  },
};
