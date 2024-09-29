import { blurbs } from "./ddBlurbs.content/blurbs.js";

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    console.info("💬 Sutta blurbs displayed on hover");

    let toastTimeout: NodeJS.Timeout | null = null;
    let hoveringToast = false;
    let hoveringLink = false;
    let hideTimeout: NodeJS.Timeout | null = null;

    // Create the toast element
    const createToast = () => {
      const toast = document.createElement("div");
      toast.id = "sutta-toast";
      toast.style.position = "fixed";
      toast.style.bottom = "20px";
      toast.style.right = "20px";
      toast.style.padding = "10px";
      toast.style.backgroundColor = "#333";
      toast.style.color = "#fff";
      toast.style.borderRadius = "5px";
      toast.style.zIndex = "1000";
      toast.style.display = "none";
      toast.style.maxWidth = "300px"; // Set max width to 300px
      document.body.appendChild(toast);

      // Add event listener to detect mouse hovering over the toast
      toast.addEventListener("mouseover", () => {
        hoveringToast = true;
        if (hideTimeout) {
          clearTimeout(hideTimeout); // Prevent the toast from hiding when hovering over it
        }
      });
      toast.addEventListener("mouseout", () => {
        hoveringToast = false;
        if (!hoveringLink) {
          hideToastWithDelay(toast); // Hide when moving out of both toast and link
        }
      });

      return toast;
    };

    const showToast = (toast: HTMLElement, message: string) => {
      toast.innerText = message;
      toast.style.display = "block";
    };

    const hideToast = (toast: HTMLElement) => {
      toast.style.display = "none";
      if (toastTimeout) {
        clearTimeout(toastTimeout); // Clear timeout if hiding before it shows
        toastTimeout = null;
      }
    };

    const hideToastWithDelay = (toast: HTMLElement) => {
      hideTimeout = setTimeout(() => {
        if (!hoveringLink && !hoveringToast) {
          hideToast(toast);
        }
      }, 100); // Small delay before hiding to allow moving between link and toast
    };

    // Initialize the toast
    const toast = createToast();

    // Event listeners for detecting link hover
    document.addEventListener("mouseover", event => {
      const target = event.target as HTMLAnchorElement;
      if (target.tagName === "A" && target.href.includes("suttacentral.net")) {
        hoveringLink = true;
        const idMatch = target.href.match(/suttacentral\.net\/([^\/]+)/);
        if (idMatch) {
          const id = idMatch[1]; // Extract the ID from the URL
          const message = blurbs[id]; // Look up the message from blurbs.js
          if (message) {
            toastTimeout = setTimeout(() => showToast(toast, message), 400); // Delay of 400ms
          }
        }
      }
    });

    document.addEventListener("mouseout", event => {
      const target = event.target as HTMLAnchorElement;
      if (target.tagName === "A" && target.href.includes("suttacentral.net")) {
        hoveringLink = false;
        if (!hoveringToast) {
          hideToastWithDelay(toast); // Delay hiding the toast unless hovering over it
        }
      }
    });
  },
});
