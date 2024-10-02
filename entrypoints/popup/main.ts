import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
  <h3>On Sutta Central.net</h3>
    <li>changes the theme to “Shamrock Shake”</li>
    <li>"Random Sutta" link added to homepage</li>
    <li>Reading time given on text pages</li>
    <li><kbd>q</kbd> will open a popup with a QR Code</li>
    <li><kbd>u</kbd> will copy the bare url</li>
    <li><kbd>l</kbd> will copy a link to the current page in markdown format, e.g. <code>[DN 1 Brahmajālasutta](https://suttacentral.net/dn1/en/sujato)</code></li>
    <li>on text pages <kbd>c</kbd> will copy the heading and body of the text (aka sutta) to the clipboard. If the root is visible it will copy that too. If notes are turned on (even on asterisks) that will get copied too.</li>
    <li>Current site language is persistently displayed above the three dot menu icon</li>
    <li>There is a mockup of a new navigation menu.</li>
    <h3>On All sites</h3>
    <li>Hovering with the mouse over a link to suttas on SuttaCentral.net will pop up the blurb for that sutta.</li>
</div>
`;
