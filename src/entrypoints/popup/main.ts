import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
  <h3>On Sutta Central.net</h3>
    <li>Changes the theme to <strong>“Ronnie”</strong></li>
    <li><strong>Random Sutta</strong> link added to homepage</li>
    <li><strong>Segments swapped:</strong> Root appears first or on the left</li>
    <li>Notification of <strong>additional translations</strong> in user's language</li>
    <li>Notification of <strong>Pāli parallels</strong></li>
    <li>Clicking segment number copies URL to that segment to the clipboard.
    <li><kbd>.</kbd> to <strong>select only translation</strong></li>
    <li><kbd>,</kbd> to <strong>select only root</strong> language</li>
    <li><kbd>q</kbd> will open a popup with a <strong>QR Code</strong></li>
    <li><kbd>u</kbd> will <strong>copy the bare url</strong></li>
    <li><kbd>l</kbd> will copy a link to the current page in <strong>markdown format</strong>, e.g. <br><code>[DN 1 Brahmajālasutta](https://suttacentral.net/dn1/en/sujato)</code></li>
    <li><kbd>h</kbd> to show <strong>how long it will take to read</strong></li>
    <li><kbd>c</kbd> <strong>copies the heading and body of the entire text</strong> to the clipboard. Visible root and notes (even on asterisks) will get copied too.</li>
    <li><strong>Current site language</strong> is persistently displayed above the three dot menu icon</li>
    <li>There is a mockup of a new navigation menu.</li>
    <li>Test of vertical view settings panel</li>

    <h3>On All sites</h3>
    <li>Hovering with the mouse over a link to suttas on SuttaCentral.net will <strong>pop up the blurb</strong> for that sutta.</li>
    <li><strong>Context menu item</strong> for selected text to search on SuttaCentral.net, search on the forum, go to suttaplex card, go to sutta text, and search PTS citation. </li>
</div>
`;
