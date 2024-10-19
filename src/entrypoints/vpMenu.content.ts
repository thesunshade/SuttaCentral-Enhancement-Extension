import { querySelectorDeep } from "query-selector-shadow-dom";
import ally from "ally.js";
import isInputFocused from "./functions/isInputFocused";
import onlyPressed from "./functions/onlyPressed";
import menu from "./VpMenu/index.html?raw";
import "./VpMenu/sc-custommenu.css";
import { exactData } from "./data/exact.js";
import { normalizedData } from "./data/normalized";
import normalizeString from "./functions/normalizeString.js";
import { domBuilder } from "./VpMenu/domBuilder";

function createInstantLookup() {
  const containerInstantLookup = domBuilder.containerInstantLookup();
  const wrapperInstantLookupInput = domBuilder.wrapperInstantLookupInput();
  containerInstantLookup.appendChild(wrapperInstantLookupInput);
  const inputInstantLookup = domBuilder.inputInstantLookup();
  const labelInstantLookup = domBuilder.labelInstantLookup();
  containerInstantLookup.appendChild(labelInstantLookup);
  wrapperInstantLookupInput.appendChild(inputInstantLookup);
  const clearButtonInstantLookup = domBuilder.clearButtonInstantLookup();
  wrapperInstantLookupInput.appendChild(clearButtonInstantLookup);
  const dropdownInstantLookupResults = domBuilder.dropdownInstantLookupResults();
  containerInstantLookup.appendChild(wrapperInstantLookupInput);
  containerInstantLookup.appendChild(dropdownInstantLookupResults);
  const styleForInstantLookup = domBuilder.styleForInstantLookup();
  document.head.appendChild(styleForInstantLookup);

  // Add event listener to clear the input when the button is clicked
  clearButtonInstantLookup.addEventListener("click", () => {
    inputInstantLookup.value = "";
    dropdownInstantLookupResults.innerHTML = "";
  });

  inputInstantLookup.addEventListener("focus", function () {
    inputInstantLookup.placeholder = "Enter a citation or text name";
  });

  inputInstantLookup.addEventListener("blur", function () {
    inputInstantLookup.placeholder = "Jump to a sutta";
  });

  // prevent hotkeys from firing
  inputInstantLookup.addEventListener("keydown", (e: KeyboardEvent) => {
    // Stop event propagation for all single key presses (prevent site hotkeys)
    e.stopPropagation();

    // Allow the default behavior to let the user type in the input field
    // Only prevent the default for special actions (like Enter, Escape, etc.)
    if (["ArrowUp", "ArrowDown", "Enter", "Escape"].includes(e.key)) {
      e.preventDefault();
    }
  });

  let activeIndex = -1;
  let results: Array<{ normStr: string; exact: string }> = [];

  const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>): void => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
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
      dropdownInstantLookupResults.style.display = "none";
    }
  };

  const displayResults = (results: Array<{ normStr: string; exact: string }>) => {
    dropdownInstantLookupResults.innerHTML = "";
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

      dropdownInstantLookupResults.appendChild(item);
    });

    dropdownInstantLookupResults.style.display = results.length > 0 ? "block" : "none";
  };

  const selectResult = (exactValue: string) => {
    const baseUrl = "https://suttacentral.net/";
    let firstPart = exactValue.split(" ")[0];
    firstPart = firstPart.replace(/<\/?code>/g, "");
    const url = `${baseUrl}${firstPart}/xx/xx`;
    window.location.href = url;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const items = dropdownInstantLookupResults.querySelectorAll(".dropdown-item");
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
        inputInstantLookup.value = "";
        dropdownInstantLookupResults.style.display = "none";
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

  inputInstantLookup.addEventListener("input", e => debouncedSearch((e.target as HTMLInputElement).value));
  inputInstantLookup.addEventListener("keydown", handleKeyDown);

  return containerInstantLookup;
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
    if (inputBox) {
      inputBox.focus();
    }
  }
}

function injectStyles() {
  const styleVpMenu = domBuilder.styleVpMenu();
  document.head.appendChild(styleVpMenu);
}

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    const vpHamburger = domBuilder.vpHamburger();

    function handleBreadCrumb(breadcrumb: HTMLElement) {
      breadcrumb.insertBefore(vpHamburger, breadcrumb.firstChild);

      const vpMenu = document.createElement("div");
      vpMenu.id = "vpNavigationMenu";
      vpMenu.innerHTML = menu;

      setTimeout(() => {
        const breadcrumbWrapper = querySelectorDeep(".breadcrumbs-wrapper");
        if (breadcrumbWrapper !== null) {
          breadcrumbWrapper.style.marginLeft = "90px";
        }
      }, 100);

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
