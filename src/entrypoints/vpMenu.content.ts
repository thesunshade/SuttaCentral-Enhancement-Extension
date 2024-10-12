import { querySelectorDeep } from "query-selector-shadow-dom";
import ally from "ally.js";
import menu from "./VpMenu/index.html?raw";
import "./VpMenu/sc-custommenu.css";

function closeMenuOnOutsideClick(navMenu: HTMLElement, vpHamburger: HTMLElement) {
  document.addEventListener("click", event => {
    const target = event.target as HTMLElement;

    // Close the menu only if it is open and the click is outside both the navMenu and the vpHamburger
    if (navMenu.style.display === "block" && !navMenu.contains(target) && !vpHamburger.contains(target)) {
      navMenu.style.display = "none";
      // console.log("Navigation menu closed due to click outside the menu.");
    }
  });

  // Prevent the click on the hamburger from closing the menu immediately
  vpHamburger.addEventListener("click", event => {
    event.stopPropagation(); // Stop the click event from reaching the document listener
  });
}

function closeMenuOnClick(links: NodeListOf<Element>, navMenu: HTMLElement) {
  links.forEach(link => {
    link.addEventListener("click", event => {
      const currentUrl = window.location.href; // Store the current URL

      // Use a slight delay to check the URL after the click event
      setTimeout(() => {
        const newUrl = window.location.href;
        // Close the menu only if the URL has changed (indicating a navigation)
        if (newUrl !== currentUrl) {
          navMenu.style.display = "none";
          // console.log("Navigation menu closed after clicking a link that caused page navigation.");
        }
      }, 100);
    });
  });
}

function closeMenuOnScroll(navMenu: HTMLElement) {
  let isMouseOverMenu = false;

  // Track whether the mouse is over the navigation menu
  navMenu.addEventListener("mouseenter", () => {
    isMouseOverMenu = true;
  });

  navMenu.addEventListener("mouseleave", () => {
    isMouseOverMenu = false;
  });

  // Close the menu only if the page is scrolled and the mouse is not over the menu
  window.addEventListener("scroll", () => {
    if (!isMouseOverMenu && navMenu.style.display === "block") {
      navMenu.style.display = "none";
      // console.log("Navigation menu closed due to page scroll.");
    }
  });
}

function toggleMenu(vpHamburger: HTMLElement, navMenu: HTMLElement) {
  if (navMenu) {
    const rect = vpHamburger.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    // Set the position relative to the current scroll position
    navMenu.style.top = `${rect.bottom + 14 + scrollTop}px`;
    navMenu.style.left = `${rect.left - 5 + scrollLeft}px`;
    navMenu.style.display = navMenu.style.display === "block" ? "none" : "block";
  } else {
    // console.log("Navigation menu not found.");
  }
}

function injectStyles() {
  // console.log("Injecting styles...");
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
  `;
  document.head.appendChild(style);
}

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    const vpHamburger = document.createElement("div");
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

    function handleBreadCrumb(breadcrumb: HTMLElement) {
      // console.log("Hamburger icon added.");
      breadcrumb.insertBefore(vpHamburger, breadcrumb.firstChild);

      const vpMenu = document.createElement("div");
      vpMenu.id = "vpNavigationMenu";
      vpMenu.innerHTML = menu;

      document.body.appendChild(vpMenu);

      injectStyles();

      vpHamburger.addEventListener("click", () => toggleMenu(vpHamburger, vpMenu));

      closeMenuOnClick(vpMenu.querySelectorAll("a"), vpMenu);
      closeMenuOnScroll(vpMenu);
      closeMenuOnOutsideClick(vpMenu, vpHamburger);
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
            // console.log("Breadcrumb found:", breadcrumb);
            observer.disengage();
            callback(breadcrumb);
          }
        },
      });
    }

    function updateMenuVisibility() {
      chrome.storage.sync.get("vpMenuShow", result => {
        const vpMenuShow = result.vpMenuShow;
        // console.log("vpMenuShow setting:", vpMenuShow);

        if (vpMenuShow === "true") {
          const vpHamburgerExisting = querySelectorDeep("#vpHamburger") as HTMLElement;
          if (!vpHamburgerExisting) {
            // console.log("vpMenuShow is true. Adding hamburger icon.");
            observeBreadCrumb(handleBreadCrumb); // Inject the menu if vpMenuShow is "true"
          }
        } else {
          // console.log("vpMenuShow is false. Removing hamburger icon if present.");
          const vpHamburgerExisting = querySelectorDeep("#vpHamburger") as HTMLElement;
          if (vpHamburgerExisting) {
            // console.log("Hamburger icon found, attempting to remove...");
            vpHamburgerExisting.remove(); // Remove the hamburger icon
            // console.log("Hamburger icon removed.");
          } else {
            // console.log("Hamburger icon not found, nothing to remove.");
          }
        }
      });
    }

    // Initial check for the setting
    updateMenuVisibility();

    // Listen for changes to the setting in storage and update immediately
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === "sync" && changes.vpMenuShow) {
        // console.log("Storage change detected for vpMenuShow. Updating menu visibility.");
        updateMenuVisibility();
      }
    });
  },
});
