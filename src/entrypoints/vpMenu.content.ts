import { querySelectorDeep } from "query-selector-shadow-dom";
import ally from "ally.js";
import isInputFocused from "./functions/isInputFocused";
import onlyPressed from "./functions/onlyPressed";
import menu from "./VpMenu/index.html?raw";
import "./VpMenu/sc-custommenu.css";
import { exactData } from "./data/exact.js";
import { normalizedData } from "./data/normalized";
import normalizeString from "./functions/normalizeString.js";

function createInstantLookup() {
  const container = document.createElement("div");
  container.className = "instant-lookup";

  // Create wrapper to hold input and button
  const wrapper = document.createElement("div");
  wrapper.className = "input-wrapper";
  container.appendChild(wrapper);

  const input = document.createElement("input");
  input.type = "text";
  input.id = "instantLookupInput";
  input.className = "instant-lookup-box";
  input.placeholder = "Jump to a sutta…";

  const label = document.createElement("label");
  label.htmlFor = "instantLookupInput"; // Associate the label with the input field
  label.textContent = "Enter citation or sutta name for instant lookup";
  label.className = "sr-only"; // Apply hidden style

  container.appendChild(label);
  wrapper.appendChild(input);

  // Create the clear button
  const clearButton = document.createElement("button");
  clearButton.className = "clear-button";
  clearButton.innerHTML = "✖";
  wrapper.appendChild(clearButton);

  // Add event listener to clear the input when the button is clicked
  clearButton.addEventListener("click", () => {
    input.value = "";
  });

  input.addEventListener("focus", function () {
    input.placeholder = "Enter a citation or text name";
  });

  input.addEventListener("blur", function () {
    input.placeholder = "Jump to a sutta";
  });

  input.addEventListener("keydown", (e: KeyboardEvent) => {
    // Allow keyboard navigation within the dropdown
    if (["ArrowUp", "ArrowDown", "Enter", "Escape"].includes(e.key)) {
      return;
    }
    // Prevent propagation for all other keys
    e.preventDefault();
    e.stopPropagation();
  });

  const dropdown = document.createElement("div");
  dropdown.id = "dropdown";
  dropdown.className = "dropdown";

  container.appendChild(wrapper);
  container.appendChild(dropdown);

  // Style the input and button
  const style = document.createElement("style");
  style.innerHTML = `
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
  }
`;
  document.head.appendChild(style);

  let activeIndex = -1;
  let results: Array<{ normStr: string; exact: string }> = [];

  const debounce = (fn: Function, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
    };
  };

  const performSearch = (query: string) => {
    const normalizedQuery = normalizeString(query);

    if (normalizedQuery.length >= 2) {
      results = normalizedData
        .map((normStr, index) => ({ normStr, exact: exactData[index] }))
        .filter(item => {
          if (normalizedQuery.startsWith(":")) {
            const searchString = normalizedQuery.slice(1);
            return item.normStr.startsWith(searchString);
          }
          return item.normStr.includes(normalizedQuery);
        });

      displayResults(results);
    } else {
      dropdown.style.display = "none";
    }
  };

  const displayResults = (results: Array<{ normStr: string; exact: string }>) => {
    dropdown.innerHTML = "";
    results.forEach(result => {
      const item = document.createElement("a"); // Change to 'a' element
      item.classList.add("dropdown-item");
      item.innerHTML = result.exact;

      // Construct the URL for the link
      const baseUrl = "https://suttacentral.net/";
      let firstPart = result.exact.split(" ")[0].replace(/<\/?code>/g, "");
      const url = `${baseUrl}${firstPart}/xx/xx`;

      item.href = url; // Set the href attribute
      item.target = "_blank"; // Optional: open in a new tab
      item.rel = "noopener noreferrer"; // Optional: security best practices

      // Remove the click listener as it's no longer needed
      // item.addEventListener("click", () => selectResult(result.exact));

      dropdown.appendChild(item);
    });

    dropdown.style.display = results.length > 0 ? "block" : "none";
  };

  const selectResult = (exactValue: string) => {
    const baseUrl = "https://suttacentral.net/";
    let firstPart = exactValue.split(" ")[0];
    firstPart = firstPart.replace(/<\/?code>/g, "");
    const url = `${baseUrl}${firstPart}/xx/xx`;
    window.location.href = url;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const items = dropdown.querySelectorAll(".dropdown-item");
    if (items.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        activeIndex = (activeIndex + 1) % items.length;
        break;
      case "ArrowUp":
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        break;
      case "Enter":
        if (activeIndex === -1) {
          activeIndex = 0;
        }
        selectResult(results[activeIndex].exact);
        break;
      case "Escape":
        input.value = "";
        dropdown.style.display = "none";
        activeIndex = -1;
        break;
      default:
        return;
    }

    items.forEach(item => item.classList.remove("active"));
    if (activeIndex >= 0) {
      items[activeIndex].classList.add("active");
      (items[activeIndex] as HTMLElement).scrollIntoView({ block: "nearest" });
    }
  };

  const debouncedSearch = debounce(performSearch, 300);

  input.addEventListener("input", e => debouncedSearch((e.target as HTMLInputElement).value));
  input.addEventListener("keydown", handleKeyDown);

  return container;
}

function toggleMenuWithKey(vpMenu, vpHamburger) {
  // Keydown event listener to toggle the menu
  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (onlyPressed(event, "=") && !isInputFocused()) {
      if (vpHamburger && vpMenu) {
        toggleMenu(vpHamburger, vpMenu, event); // Toggle the menu visibility
      } else {
        console.log("Menu elements not found");
      }
    }
  });
}

function closeMenuOnOutsideClick(navMenu: HTMLElement, vpHamburger: HTMLElement) {
  document.addEventListener("click", event => {
    const target = event.target as HTMLElement;
    if (navMenu.style.display === "block" && !navMenu.contains(target) && !vpHamburger.contains(target)) {
      navMenu.style.display = "none";
    }
  });

  vpHamburger.addEventListener("click", event => {
    event.stopPropagation();
  });
}

function closeMenuOnClick(links: NodeListOf<Element>, navMenu: HTMLElement) {
  links.forEach(link => {
    link.addEventListener("click", event => {
      const currentUrl = window.location.href;
      setTimeout(() => {
        const newUrl = window.location.href;
        if (newUrl !== currentUrl) {
          navMenu.style.display = "none";
        }
      }, 100);
    });
  });
}

function closeMenuOnScroll(navMenu: HTMLElement) {
  let isMouseOverMenu = false;

  navMenu.addEventListener("mouseenter", () => {
    isMouseOverMenu = true;
  });

  navMenu.addEventListener("mouseleave", () => {
    isMouseOverMenu = false;
  });

  window.addEventListener("scroll", () => {
    if (!isMouseOverMenu && navMenu.style.display === "block") {
      navMenu.style.display = "none";
    }
  });
}

function toggleMenu(vpHamburger: HTMLElement, navMenu: HTMLElement, event) {
  console.log("menu toggle");
  if (navMenu) {
    const rect = vpHamburger.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    // Set the position relative to the current scroll position
    navMenu.style.top = `${rect.bottom + 14 + scrollTop}px`;
    navMenu.style.left = `${rect.left - 5 + scrollLeft}px`;
    navMenu.style.display = navMenu.style.display === "block" ? "none" : "block";
    const inputBox = querySelectorDeep("#instantLookupInput");
    console.log(inputBox);
    event.preventDefault();
    // setTimeout(() => {
    inputBox.focus();
    // }, 1050);
  }
}

function injectStyles() {
  const style = document.createElement("style");
  style.textContent = `
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
  document.head.appendChild(style);
}

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    const vpHamburger = document.createElement("button");
    vpHamburger.id = "vpHamburger";
    vpHamburger.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="4" rx="2" fill="white" />
        <rect y="13" width="30" height="4" rx="2" fill="white" />
        <rect y="26" width="30" height="4" rx="2" fill="white" />
      </svg>
    `;
    vpHamburger.style.cursor = "pointer";
    vpHamburger.style.marginLeft = "10px";
    vpHamburger.style.setProperty("background-color", "transparent", "important");
    vpHamburger.style.border = "solid 0px black";

    function handleBreadCrumb(breadcrumb: HTMLElement) {
      breadcrumb.insertBefore(vpHamburger, breadcrumb.firstChild);

      const vpMenu = document.createElement("div");
      vpMenu.id = "vpNavigationMenu";
      vpMenu.innerHTML = menu;

      const lookupComponent = createInstantLookup();
      vpMenu.insertBefore(lookupComponent, vpMenu.firstChild);

      document.body.appendChild(vpMenu);

      injectStyles();

      vpHamburger.addEventListener("click", event => toggleMenu(vpHamburger, vpMenu, event));

      closeMenuOnClick(vpMenu.querySelectorAll("a"), vpMenu);
      closeMenuOnScroll(vpMenu);
      closeMenuOnOutsideClick(vpMenu, vpHamburger);
      toggleMenuWithKey(vpMenu, vpHamburger);
    }

    function observeBreadCrumb(callback: (breadcrumb: HTMLElement) => void) {
      const observer = ally.observe.shadowMutations({
        config: {
          childList: true,
          subtree: true,
        },
        callback: () => {
          const breadcrumb = querySelectorDeep(".top-bar-home-link") as HTMLElement;
          if (breadcrumb) {
            observer.disengage();
            callback(breadcrumb);
          }
        },
      });
    }

    function updateMenuVisibility() {
      chrome.storage.sync.get("vpMenuShow", result => {
        const vpMenuShow = result.vpMenuShow;
        if (vpMenuShow === "true") {
          const vpHamburgerExisting = querySelectorDeep("#vpHamburger") as HTMLElement;
          if (!vpHamburgerExisting) {
            observeBreadCrumb(handleBreadCrumb);
          }
        } else {
          const vpHamburgerExisting = querySelectorDeep("#vpHamburger") as HTMLElement;
          if (vpHamburgerExisting) {
            vpHamburgerExisting.remove();
          }
        }
      });
    }

    updateMenuVisibility();

    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === "sync" && changes.vpMenuShow) {
        updateMenuVisibility();
      }
    });
  },
});
