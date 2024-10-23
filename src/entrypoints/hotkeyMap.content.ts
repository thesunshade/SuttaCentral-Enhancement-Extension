import isInputFocused from "./functions/isInputFocused";

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main(ctx) {
    async function createTable(data) {
      const table = document.createElement("table");

      // Create table header
      const headerRow = document.createElement("tr");
      const headerCell1 = document.createElement("th");
      headerCell1.textContent = "Key";
      const headerCell2 = document.createElement("th");
      headerCell2.textContent = "Action";
      headerRow.appendChild(headerCell1);
      headerRow.appendChild(headerCell2);
      table.appendChild(headerRow);

      // Get all relevant settings from chrome.storage.sync
      const keysToCheck = data
        .filter(item => item.extensionKey) // Only items with an extensionKey
        .map(item => item.extensionKey);

      keysToCheck.push("mirrorHotkeys");

      const storedValues = await chrome.storage.sync.get(keysToCheck);

      // Add data to the table
      data.forEach(item => {
        const row = document.createElement("tr");
        const cell1 = document.createElement("td");
        cell1.classList.add("key-names");
        const cell2 = document.createElement("td");
        let keyNames = `<kbd>${item.shortcut}</kbd>`;
        if (item.mirror && storedValues["mirrorHotkeys"] === "true") {
          keyNames += ` or <kbd>${item.mirror}</kbd>`;
        }
        cell1.innerHTML = keyNames;

        let actionRow = item.action;
        if (item.extensionKey && storedValues[item.extensionKey] === "false") {
          actionRow = `<span class="disabled">${actionRow} (disabled)</span>`;
        }

        cell2.innerHTML = actionRow;
        row.appendChild(cell1);
        row.appendChild(cell2);
        table.appendChild(row);
      });

      const dialog = document.createElement("div");
      dialog.id = "hotkey-map";
      dialog.style.cssText = `
      position:fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width:700px;
      max-width: 90vw;
      max-height:90vh;
      overflow-y: auto;
      z-index:1001;
      `;
      dialog.appendChild(table);

      const tableStyle = document.createElement("style");
      tableStyle.innerHTML = `
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 0px;
          background-color: var(--sc-tertiary-background-color);
        }
        kbd {
          display: inline-block;
          text-align: center;
          margin: 0px 0.1em;
          min-width: 1.2rem;
          border-radius: 3px;
          border: 1px solid rgb(204, 204, 204);
          color: rgb(51, 51, 51);
          line-height: 1.3;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 0.8rem;
          font-weight: bold;
          box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.2), inset 0px 0px 0px 2px #ffffff;
          background-color: rgb(247, 247, 247);
          text-shadow: 0 1px 0 #fff;
        }
        th, td {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: left;
        }
        th {
          background-color: var(--sc-primary-color-dark);
          color: white;
        }
        td.key-names:first-child {
          font-weight:normal
          }
        .key-names {
          white-space:nowrap;
          font-weight:normal;
          }
        .disabled {
          color: gray;
          }
        @media (max-width: 600px) {
          /* Add responsive styles if needed */
        }
      `;
      dialog.appendChild(tableStyle);

      return dialog;
    }

    // Define the data
    const shortcutsData = [
      { shortcut: "v", action: "Toggle through three view states for aligned texts (plain/side by side/line by line)", mirror: "1" },
      { shortcut: "s", action: "Open the top search bar and place cursor ready to search", mirror: "2" },
      { shortcut: "n", action: "Toggle through notes view (on asterisk/side notes/none)", mirror: "3" },
      { shortcut: "m", action: "Toggle main reference numbers on and off", mirror: "4" },
      { shortcut: "t", action: "Toggle PTS reference numbers on and off", mirror: "5" },
      { shortcut: "r", action: "Toggle all reference numbers on and off", mirror: "6" },
      { shortcut: "i", action: "Opens Info panel", mirror: "7" },
      { shortcut: "o", action: "Opens Views panel (aka options)", mirror: "8" },
      { shortcut: "p", action: "Opens Parallel panel", mirror: "9" },
      { shortcut: "esc", action: "Close all overlays", mirror: "0" },
      { shortcut: "=", action: "Opens alternate menu system", extensionKey: "vpMenuShow" },
      { shortcut: "c", action: "copies the heading and body of the entire text to the clipboard. Visible root and notes (even on asterisks) will get copied too.", extensionKey: "copyWholeText" },
      { shortcut: "u", action: "copy the bare URL", extensionKey: "copyBareLink" },
      { shortcut: "l", action: "copy a link to the current page in a custom format", extensionKey: "copyCustomLink" },
      { shortcut: "q", action: "open a popup with a QR Code", extensionKey: "qrCode" },
      { shortcut: ".", action: "select only translation", extensionKey: "selectOnlyTranslation" },
      { shortcut: ",", action: "select only root language", extensionKey: "selectOnlyRoot" },
      { shortcut: "?", action: "Show this table" },
    ];

    let uiContainer: HTMLElement | null = null;
    let cursorX = 0;
    let cursorY = 0;

    // Track mouse position
    document.addEventListener("mousemove", (event: MouseEvent) => {
      cursorX = event.clientX;
      cursorY = event.clientY;
    });

    const ui = createIntegratedUi(ctx, {
      position: "inline",
      anchor: "body",
      onMount: async container => {
        const existingTable = container.querySelector("#hotkey-map");
        const existingCloseButton = container.querySelector(".close-button");
        const existingOverlay = document.querySelector(".ui-overlay");

        if (existingTable) {
          existingTable.remove();
        }
        if (existingCloseButton) {
          existingCloseButton.remove();
        }
        if (existingOverlay) {
          existingOverlay.remove();
        }

        const tableElement = await createTable(shortcutsData);

        // Create the "X" button
        const closeButton = document.createElement("button");
        closeButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="square" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>`;
        closeButton.classList.add("close-button");
        closeButton.style.position = "absolute";
        closeButton.style.top = "10px";
        closeButton.style.right = "10px";
        closeButton.style.zIndex = "1002";
        closeButton.style.backgroundColor = "white";
        closeButton.style.color = "black";
        closeButton.style.border = "none";
        closeButton.style.padding = "5px 5px 0px 5px";
        closeButton.style.cursor = "pointer";

        closeButton.addEventListener("click", closeUi); // Close the UI when clicked

        // Create a gray overlay
        const overlay = document.createElement("div");
        overlay.classList.add("ui-overlay");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        overlay.style.zIndex = "1000";

        overlay.addEventListener("click", closeUi);

        document.body.append(overlay);
        container.append(closeButton);
        container.append(tableElement);

        document.body.style.overflow = "hidden";

        uiContainer = container;

        // Add scroll event listener
        window.addEventListener("scroll", handleScrollToRemoveUi, { passive: true });

        // Add click event listener to close UI if clicked outside
        document.addEventListener("click", handleClickOutsideUi);
      },
    });

    function isUiMounted() {
      return uiContainer !== null;
    }

    function handleScrollToRemoveUi() {
      const elementUnderCursor = document.elementFromPoint(cursorX, cursorY);
      if (isUiMounted() && uiContainer && !uiContainer.contains(elementUnderCursor)) {
        closeUi();
      }
    }

    function handleClickOutsideUi(event: MouseEvent) {
      // Check if the click target is outside the uiContainer
      if (isUiMounted() && uiContainer && !uiContainer.contains(event.target as Node)) {
        closeUi();
      }
    }

    function closeUi() {
      if (isUiMounted()) {
        ui.remove();
        uiContainer = null;

        // Remove the overlay
        const overlay = document.querySelector(".ui-overlay");
        if (overlay) {
          overlay.remove();
        }

        // Restore scrolling for the underlying page
        document.body.style.overflow = "";

        window.removeEventListener("scroll", handleScrollToRemoveUi); // Clean up scroll listener
        document.removeEventListener("click", handleClickOutsideUi); // Clean up click listener
      }
    }

    // Call mount to add the UI to the DOM
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "?" && !isInputFocused()) {
        if (!isUiMounted()) {
          ui.mount();
        } else {
          closeUi(); // Use closeUi() to handle cleanup
        }
      }

      if (event.key === "Escape" && isUiMounted()) {
        closeUi(); // Use closeUi() to handle cleanup
      }
    });
  },
});
