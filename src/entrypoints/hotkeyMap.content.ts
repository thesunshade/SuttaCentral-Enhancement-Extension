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

      const storedValues = await chrome.storage.sync.get(keysToCheck);

      // Add data to the table
      data.forEach(item => {
        const row = document.createElement("tr");
        const cell1 = document.createElement("td");
        const cell2 = document.createElement("td");
        cell1.innerHTML = `<kbd>${item.shortcut}</kbd>`;

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
      z-index:1000000;
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
      { shortcut: "s", action: "Open the top search bar and place cursor ready to search" },
      { shortcut: "v", action: "Toggle through three view states for aligned texts (plain/side by side/line by line)" },
      { shortcut: "n", action: "Toggle through notes view (on asterisk/side notes/none)" },
      { shortcut: "m", action: "Toggle main reference numbers on and off" },
      { shortcut: "t", action: "Toggle PTS reference numbers on and off" },
      { shortcut: "r", action: "Toggle all reference numbers on and off" },
      { shortcut: "i", action: "Opens Info panel" },
      { shortcut: "o", action: "Opens Views panel (aka options)" },
      { shortcut: "p", action: "Opens Parallel panel" },
      { shortcut: "esc", action: "Close all overlays" },
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
        if (existingTable) {
          existingTable.remove();
        }

        const tableElement = await createTable(shortcutsData);
        container.append(tableElement);
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
    });
  },
});
