import { querySelectorDeep } from "query-selector-shadow-dom";
import ally from "ally.js";
import menu from "./VpMenu/index.html?raw";
import "./VpMenu/sc-custommenu.css";
import "./VpMenu/bootstrap/css/bootstrap.min.css";

function closeMenuOnOutsideClick(navMenu: HTMLElement, vpHamburger: HTMLElement) {
  document.addEventListener("click", event => {
    const target = event.target as HTMLElement;

    // Close the menu only if it is open and the click is outside both the navMenu and the vpHamburger
    if (navMenu.style.display === "block" && !navMenu.contains(target) && !vpHamburger.contains(target)) {
      navMenu.style.display = "none";
      console.log("Navigation menu closed due to click outside the menu.");
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
          console.log("Navigation menu closed after clicking a link that caused page navigation.");
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
      console.log("Navigation menu closed due to page scroll.");
    }
  });
}

function toggleMenu(vpHamburger: HTMLElement, navMenu: HTMLElement) {
  console.log("Hamburger icon clicked.");
  if (navMenu) {
    const rect = vpHamburger.getBoundingClientRect();
    navMenu.style.top = `${rect.bottom}px`;
    navMenu.style.left = `0px`;
    navMenu.style.display = navMenu.style.display === "block" ? "none" : "block";
    console.log(`Toggled navigation menu visibility: ${navMenu.style.display}`);
  } else {
    console.log("Navigation menu not found.");
  }
}

function injectStyles() {
  console.log("Injecting styles...");
  const style = document.createElement("style");
  style.textContent = `
    #vpHamburger {
      padding-left: 5px;
      cursor: pointer;
    }
    #vpNavigationMenu {
      display: none;
      position: absolute;
      background-color: white;
      box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      border: 1px solid #ccc;
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
    console.log("≡ vpMenu Active on SuttaCentral.net");

    const vpHamburger = document.createElement("div");
    vpHamburger.id = "vpHamburger";
    vpHamburger.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="4" rx="2" fill="white" />
        <rect y="13" width="30" height="4" rx="2" fill="white" />
        <rect y="26" width="30" height="4" rx="2" fill="white" />
      </svg>
    `;

    function handleBreadCrumb(breadcrumb: HTMLElement) {
      breadcrumb.appendChild(vpHamburger);

      const vpMenu = document.createElement("div");
      vpMenu.id = "vpNavigationMenu";
      vpMenu.innerHTML = menu;

      document.body.appendChild(vpMenu);

      console.log("Navigation menu added to the page.");
      injectStyles();

      vpHamburger.addEventListener("click", () => toggleMenu(vpHamburger, vpMenu));

      // Close the menu when clicking a link, scrolling, or clicking outside the menu
      closeMenuOnClick(vpMenu.querySelectorAll("a"), vpMenu);
      closeMenuOnScroll(vpMenu);
      closeMenuOnOutsideClick(vpMenu, vpHamburger);

      console.log("Breadcrumb updated:", breadcrumb);
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
            console.log("Breadcrumb found:", breadcrumb);
            observer.disengage(); // Disengage as soon as the breadcrumb is found
            callback(breadcrumb);
          }
        },
      });
    }

    observeBreadCrumb(handleBreadCrumb);
  },
});
