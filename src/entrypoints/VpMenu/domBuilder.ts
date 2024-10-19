export const domBuilder = {
  containerInstantLookup(): HTMLDivElement {
    const containerInstantLookup = document.createElement("div");
    containerInstantLookup.className = "instant-lookup";
    return containerInstantLookup;
  },

  wrapperInstantLookupInput(): HTMLDivElement {
    const wrapperInstantLookupInput = document.createElement("div");
    wrapperInstantLookupInput.className = "input-wrapper";
    return wrapperInstantLookupInput;
  },

  inputInstantLookup(): HTMLInputElement {
    const inputInstantLookup = document.createElement("input");
    inputInstantLookup.type = "text";
    inputInstantLookup.id = "instantLookupInput";
    inputInstantLookup.className = "instant-lookup-box";
    inputInstantLookup.placeholder = "Jump to a sutta…";
    return inputInstantLookup;
  },

  labelInstantLookup(): HTMLLabelElement {
    const labelInstantLookup = document.createElement("label");
    labelInstantLookup.htmlFor = "instantLookupInput";
    labelInstantLookup.textContent = "Enter citation or sutta name for instant lookup";
    labelInstantLookup.className = "sr-only"; // Apply hidden style (screen reader)
    return labelInstantLookup;
  },
  clearButtonInstantLookup(): HTMLButtonElement {
    const clearButtonInstantLookup = document.createElement("button");
    clearButtonInstantLookup.className = "clear-button";
    clearButtonInstantLookup.innerHTML = "✖";
    return clearButtonInstantLookup;
  },

  dropdownInstantLookupResults(): HTMLDivElement {
    const dropdownInstantLookupResults = document.createElement("div");
    dropdownInstantLookupResults.id = "dropdown";
    dropdownInstantLookupResults.className = "dropdown";
    return dropdownInstantLookupResults;
  },

  styleForInstantLookup(): HTMLStyleElement {
    const styleForInstantLookup = document.createElement("style");
    styleForInstantLookup.innerHTML = `
            .input-wrapper {
                position: relative;
                display: inline-block;
            }
            .instant-lookup-box {
                padding-right: 30px; /* Make room for the button inside the input */
            }
            .clear-button {
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                border: none;
                background: none;
                cursor: pointer;
                font-size: 18px; /* Adjust font size to match your design */
                color: black
            }
            .clear-button:hover {
                opacity: .6;
            }
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                border: 0;
            }`;
    return styleForInstantLookup;
  },

  vpHamburger(): HTMLButtonElement {
    const vpHamburger = document.createElement("button");
    vpHamburger.id = "vpHamburger";
    vpHamburger.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="4" rx="2" fill="white" />
        <rect y="13" width="30" height="4" rx="2" fill="white" />
        <rect y="26" width="30" height="4" rx="2" fill="white" />
      </svg>`;
    vpHamburger.style.cursor = "pointer";
    vpHamburger.style.marginLeft = "10px";
    vpHamburger.style.setProperty("background-color", "transparent", "important");
    vpHamburger.style.border = "solid 0px black";
    return vpHamburger;
  },

  styleVpMenu(): HTMLStyleElement {
    const styleVpMenu = document.createElement("style");
    styleVpMenu.textContent = `
      #vpNavigationMenu {
        display: none;
        position: absolute;
        z-index: 1000;
        border: 2px 1px 0 1px solid var(--sc-dark-fixed-background-color);
        margin: 0;
        list-style: none;
        color: black;
      }
      .instant-lookup-box {
        width: 575px;
        padding: 8px;
        border: 1px solid #ccc;
        font-size: 20px;
      }
      .dropdown {
        border: 1px solid #ccc;
        width: 575px;
        position: absolute;
        max-height: 200px;
        overflow-y: auto;
        display: none;
        z-index:900000;
        background-color: var(--sc-secondary-background-color);
      }
      .dropdown-item {
      display: block;
        padding: 8px;
        cursor: pointer;
        text-decoration:none;
        color:black;
        background-color:white;
      }
      .dropdown-item code {
        background-color: rgb(222, 222, 222);
        border-radius: 5px;
        border: solid 0px;
        padding: 0 4px;
      }
      .dropdown-item:hover,
      .dropdown-item.active {
        background-color: var(--sc-primary-color-light-transparent);
      }
    `;
    return styleVpMenu;
  },
};
