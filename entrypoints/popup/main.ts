import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
  <p>The following are some features:</p>

  <h3>On Sutta Central.net</h3>

    <li>changes the theme to “Shamrock Shake”</li>
    <li>Reading time given on text pages</li>
    <li>on all pages <kbd>l</kbd> will copy a link to the current page in a nice markdown format suitable for pasting on forums, e.g. <code>[DN 1 Brahmajālasutta](https://suttacentral.net/dn1/en/sujato)</code></li>
    <li>on text pages <kbd>c</kbd> will copy the heading and body of the text (aka sutta) to the clipboard. If the root is visible it will copy that too. If notes are turned on (even on asterisks) that will get copied too.</li>
    <li>Current site language is persistently displayed above the three dot menu icon</li>
    <li>There is a mockup of a new navigation menu.</li>
    <h3>On All sites</h3>
    <li>Hovering with the mouse over a link to suttas on SuttaCentral.net will pop up the blurb for that sutta.</li>
</div>
`;
