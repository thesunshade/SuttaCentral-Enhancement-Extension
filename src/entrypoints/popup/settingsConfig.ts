export const settingsConfig = {
  displayOptionsHeading: {
    label: "Display Options",
    type: "heading",
  },
  displayOptionsDescriptions: {
    label: "Here you can control the display options for the application.",
    type: "paragraph",
  },
  theme: {
    label: "Theme",
    type: "select",
    choices: ["none", "Grimace", "Shamrock Shake", "Birdie", "Burglar", "Ronnie", "OB Mack", "Bubblegum", "Sonora", "Pumpkin Spice", "Spooky", "Isi", "Frosty", "Steeling", "Nord", "Suriya", "Addharatta", "Shamrock Shake Dark"],
    default: "none",
  },
  languageSwap: {
    label: "Root language appears first or on the left",
    type: "checkbox",
    default: "true",
  },
  viewOptionsShrink: {
    label: "Shrink the view options so there is no horizontal scroll. Refresh page to see.",
    type: "checkbox",
    default: "true",
  },
  viewHeadingIds: {
    label: "Show segment ids for headings.",
    type: "checkbox",
    default: "false",
  },
  colorOptionsDescriptions: {
    label: "Enter valid CSS colors below. Hit Enter to update. Leave blank to use default.",
    type: "paragraph",
  },
  rootColor: {
    label: "Color of root language text (e.g. Pāli, Sanskrit, Classical Chinese).",
    type: "text",
    default: "",
  },
  translationColor: {
    label: "Color of translation text.",
    type: "text",
    default: "",
  },
  featuresOptionsHeading: {
    label: "Added features",
    type: "heading",
  },
  featuresOptionsDescriptions: {
    label: "Various features and functionality for SuttaCentral.net.",
    type: "paragraph",
  },
  vpMenuShow: {
    label: "Add new navigation menu under three bar menu icon in top left. <kbd>=</kbd> to toggle.",
    type: "checkbox",
    default: "true",
  },
  randomLink: {
    label: "Add link to random sutta on home page",
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
  rootOnLegacy: {
    label: "Add root to legacy translation. Page refresh required. Not configurable through regular view options.",
    type: "checkbox",
    default: "false",
  },
  clickSegmentNumbersToCopyUrl: {
    label: "Clicking segment number copies URL to that segment to the clipboard.",
    type: "checkbox",
    default: "false",
  },
  addedTextBrackets: {
    label: "Adds brackets around text added by translator",
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
    default: "false",
  },
  wordsPerMinute: {
    label: "Words Per Minute to calculate reading time",
    type: "select",
    choices: ["100", "150", "200", "250", "300", "350", "400", "450"],
    default: "200",
  },
  hotkeysOptionsContextHeading: {
    label: "Hotkeys",
    type: "heading",
  },
  hotkeysOptionsContextDescription: {
    label: "Single keys to do things on SuttaCentral.net. <kbd>?</kbd> to open a table of all hotkeys.",
    type: "paragraph",
  },
  copyWholeText: {
    label: "<kbd>c</kbd> <strong>copies the heading and body of the entire text</strong> to the clipboard. Visible root and notes (even on asterisks) will get copied too.",
    type: "checkbox",
    default: "true",
  },
  copyBareLink: {
    label: "<kbd>u</kbd> to copy the bare URL",
    type: "checkbox",
    default: "true",
  },
  copyCustomLink: {
    label: "<kbd>l</kbd> to copy a link to the current page in <strong>a custom format</strong>",
    type: "checkbox",
    default: "true",
  },
  linkCustomizeDetails: {
    type: "details",
    summary: "Click for instructions",
    content: `<p>Build a link using the following placeholders plus any text:</p>
    <ul>
    <li><code>{citation}</code> sutta number</li>
    <li><code>{link}</code> sutta link</li>
    <li><code>{clean}</code> sutta link with all parameters cleaned</li>
    <li><code>{suttaplex}</code>link to suttaplex page</li>
    <li><code>{pali}</code> Pali title</li>
    <li><code>{title}</code> translation title</li>
    <li><code>{author}</code> translator name</li>
    <li><code>{language}</code> translation language</li>
    <li><code>{date}</code> translation date</li>
    </ul>
    `,
  },
  linkPattern: {
    label: "Pattern to use for link.",
    type: "text",
    default: "[{citation} {pali}: {title}, by {author}, {date}]({clean})",
  },
  qrCode: {
    label: "<kbd>q</kbd> to open a popup with a <strong>QR Code</strong>",
    type: "checkbox",
    default: "false",
  },
  selectOnlyTranslation: {
    label: "<kbd>.</kbd> to <strong>select only translation</strong>",
    type: "checkbox",
    default: "false",
  },
  selectOnlyRoot: {
    label: "<kbd>,</kbd> to <strong>select only root</strong> language",
    type: "checkbox",
    default: "false",
  },
  mirrorHotkeys: {
    label: "Mirror the native SuttaCentral hotkeys to number keys. This could be useful for non-Latin keyboard users. ⚠️ Experimental",
    type: "checkbox",
    default: "false",
  },
  mirrorHotkeysDetails: {
    type: "details",
    summary: "Key mapping",
    content: `<p>The following keys will be mirrored. Original keys will still work.</p>
    <ul>
      <li><kbd>v</kbd> ⇒ <kbd>1</kbd></li>
      <li><kbd>s</kbd> ⇒ <kbd>2</kbd></li>
      <li><kbd>n</kbd> ⇒ <kbd>3</kbd></li>
      <li><kbd>m</kbd> ⇒ <kbd>4</kbd></li>
      <li><kbd>t</kbd> ⇒ <kbd>5</kbd></li>
      <li><kbd>r</kbd> ⇒ <kbd>6</kbd></li>
      <li><kbd>i</kbd> ⇒ <kbd>7</kbd></li>
      <li><kbd>o</kbd> ⇒ <kbd>8</kbd></li>
      <li><kbd>p</kbd> ⇒ <kbd>9</kbd></li>
      <li><kbd>Escape</kbd> ⇒ <kbd>0</kbd></li>
    </ul>
    `,
  },
  displayOptionsContextHeading: {
    label: "Context Menu",
    type: "heading",
  },
  displayOptionsContextDescription: {
    label: "These features allow you to select text and right click to do various searches or go rightt to texts on the website. These features apply to all sites you visit, not just SuttaCentral.net",
    type: "paragraph",
  },
  contextSearchSuttacentral: {
    label: "Context menu search on SuttaCentral.net",
    type: "checkbox",
    default: "true",
  },
  contextSearchForum: {
    label: "Context menu search on discourse.SuttaCentral.net",
    type: "checkbox",
    default: "true",
  },
  contextGoToSuttaplex: {
    label: "Context menu go to suttaplex citation",
    type: "checkbox",
    default: "true",
  },
  contextGoToSutta: {
    label: "Context menu go to sutta citation",
    type: "checkbox",
    default: "true",
  },
  contextSearchPts: {
    label: "Context menu search PTS citation",
    type: "checkbox",
    default: "true",
  },
  blurbOptionsContextHeading: {
    label: "Sutta summary popups",
    type: "heading",
  },
  blurbOptionsContextDescription: {
    label: "This allows you to hover over links to SuttaCentral.net and have a summary (aka blurb) pop up in the lower right hand corner.",
    type: "paragraph",
  },
  showBlurbs: {
    label: "Show sutta summaries hovering over SC links",
    type: "checkbox",
    default: "true",
  },
  showBlurbsExcludeSites: {
    label: "Sites to not show sutta summaries on. Put each site on a new line. <br><strong>NOTE: ⚠️ This setting only works on Chrome type browsers.</strong>",
    type: "textarea",
    default: "index.readingfaithfully.org\nsutta.readingfaithfully.org",
  },
  omniboxOptionsContextHeading: {
    label: "Omnibox search",
    type: "heading",
  },
  omniboxOptionsContextDescription: {
    label: 'This allows you to type "sc " followed by a space and either a citation or the name of a sutta in the omnibox (aka URL bar, aka search bar) to get a direct link to a sutta.',
    type: "paragraph",
  },
  searchFromUrlBar: {
    label: "Search for sutta names or citations in omni bar",
    type: "checkbox",
    default: "true",
  },
  ddSettingsHeading: {
    label: "D&D Forum settings",
    type: "heading",
  },
  ddFavicon: {
    label: "Give the forum a unique favicon. ⚠️Experimental",
    type: "checkbox",
    default: "true",
  },

  advancedHeading: {
    label: "Advanced",
    type: "heading",
  },
  advancedDescription: {
    label: "The following are at your own risk. Only use if you know what you are doing",
    type: "paragraph",
  },
  customCssDetails: {
    type: "details",
    summary: "Click for instructions",
    content: `<p>Custom CSS will let you tailor the display of the site to your own needs. But beware! It's easy to break things. So if you ever have problems viewing the site, the first thing to try is to remove any of these.</p>
    <p>Here are some ideas:</p>
    <dl>
    <dt>Change translation font size</dt>
    <dd><code>.translation {font-size:140%}</code></dd>
    <dt>Change notes font size</dt>
    <dd><code>.comment {font-size:120%!important}</code></dd>
    </dl>
    `,
  },
  customScCss: {
    label: "Add custom CSS to the main SuttaCentral.net website.",
    type: "textarea",
    default: "",
  },
  customDdCss: {
    label: "Add custom CSS to the SC forum website.",
    type: "textarea",
    default: "",
  },
  supportHeading: {
    label: "Support",
    type: "heading",
  },
  supportDescription: {
    label: `There are several ways to offer feedback and get support. The best is to post a comment in <a href="https://discourse.suttacentral.net/t/developing-a-browser-plugin-for-suttacentral/36074"  rel="noreferrer" target="_blank">this discussion</a> on the official SuttaCentral discussion forum. You can also use the <a href="https://readingfaithfully.org/contact/" rel="noreferrer" target="_blank">contact form</a> on ReadingFaithfully.org.`,
    type: "paragraph",
  },
};
