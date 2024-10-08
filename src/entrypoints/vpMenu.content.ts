import { querySelectorDeep } from "query-selector-shadow-dom";
import ally from "ally.js";
import menu from "./VpMenu/index.html";
import "./VpMenu/sc-custommenu.css";

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
      padding: 10px;
      z-index: 1000;
      width: 550px;
      height: 450px;
      overflow: auto;
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
            callback(breadcrumb);
            observer.disengage();
          }
        },
      });
    }

    observeBreadCrumb(handleBreadCrumb);
  },
});
