import NavigationMenu from "@/components/VpNavigationMenu";
// import "./vpMenu.content/vpMenu.css";
// import "./vpMenu.content/sc-custommenu.css";

// Debug flag for logging
const DEBUG = false;

function log(...args: any[]) {
  if (DEBUG) console.log(...args);
}

// Helper function to inject CSS into the Shadow DOM
function injectShadowStyles(shadowRoot: ShadowRoot) {
  log("Injecting styles into shadow DOM...");
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
      overflow:auto;
      border: 1px solid #ccc;
      margin: 0;
      list-style: none;
      color:black;
    }
  `;
  shadowRoot.appendChild(style);
}

// Helper function to traverse shadow DOM
function queryShadowRoot(selector: string, shadowHost: Element): Element | null {
  log(`Querying shadow DOM for selector: ${selector}`);
  const shadowRoot = shadowHost.shadowRoot as ShadowRoot;
  return shadowRoot ? shadowRoot.querySelector(selector) : null;
}

// Toggle navigation menu visibility
function toggleMenu(vpHamburger: HTMLElement, shadowRoot: ShadowRoot) {
  log("Hamburger icon clicked.");
  const navMenu = shadowRoot.querySelector("#vpNavigationMenu") as HTMLElement;
  if (navMenu) {
    const rect = vpHamburger.getBoundingClientRect();
    navMenu.style.top = `${rect.bottom}px`;
    navMenu.style.left = `0px`;
    navMenu.style.display = navMenu.style.display === "block" ? "none" : "block";
    log(`Toggled navigation menu visibility: ${navMenu.style.display}`);
  } else {
    log("Navigation menu not found.");
  }
}

// Close the menu when a link is clicked
function closeMenuOnClick(links: NodeListOf<Element>, shadowRoot: ShadowRoot) {
  links.forEach(link => {
    link.addEventListener("click", () => {
      const navMenu = shadowRoot.querySelector("#vpNavigationMenu") as HTMLElement;
      if (navMenu) {
        navMenu.style.display = "none";
        log("Navigation menu closed after clicking a link.");
      }
    });
  });
}

// Close the menu when the page scrolls
function closeMenuOnScroll(shadowRoot: ShadowRoot) {
  window.addEventListener("scroll", () => {
    const navMenu = shadowRoot.querySelector("#vpNavigationMenu") as HTMLElement;
    if (navMenu && navMenu.style.display === "block") {
      navMenu.style.display = "none";
      log("Navigation menu closed due to page scroll.");
    }
  });
}

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    log("Active on SuttaCentral.net");

    const shadowHostSelector = "#breadCrumb";
    const observer = new MutationObserver(() => {
      const shadowHost = document.querySelector(shadowHostSelector) as Element;

      if (shadowHost) {
        log("Shadow host found:", shadowHost);

        const topBarHomeLink = queryShadowRoot(".top-bar-home-link", shadowHost);
        if (topBarHomeLink && !document.querySelector("#vpHamburger")) {
          log("Top bar home link found and hamburger icon doesn't exist yet.");

          const vpHamburger = document.createElement("div");
          vpHamburger.id = "vpHamburger";
          vpHamburger.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
              <rect width="30" height="4" rx="2" fill="white" />
              <rect y="13" width="30" height="4" rx="2" fill="white" />
              <rect y="26" width="30" height="4" rx="2" fill="white" />
            </svg>
          `;

          injectShadowStyles(shadowHost.shadowRoot as ShadowRoot);
          topBarHomeLink.insertAdjacentElement("afterbegin", vpHamburger);

          const menuContainer = document.createElement("div");
          const shadowRoot = menuContainer.attachShadow({ mode: "open" });

          const vpNavigationMenu = document.createElement("div");
          vpNavigationMenu.id = "vpNavigationMenu";
          vpNavigationMenu.innerHTML = NavigationMenu();
          injectShadowStyles(shadowRoot);

          shadowRoot.appendChild(vpNavigationMenu);
          vpHamburger.insertAdjacentElement("afterend", menuContainer);
          log("Navigation menu added to the page.");

          vpHamburger.addEventListener("click", () => toggleMenu(vpHamburger, shadowRoot));
          closeMenuOnClick(shadowRoot.querySelectorAll("#vpNavigationMenu a"), shadowRoot);
          closeMenuOnScroll(shadowRoot);

          observer.disconnect();
        } else {
          log("Top bar home link not found or hamburger icon already exists.");
        }
      } else {
        log("Shadow host not found.");
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  },
});
