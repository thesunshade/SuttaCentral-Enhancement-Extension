import { blurbs } from "./ddBlurbs.content/blurbs.js";
import { allSuttasPaliNameDictionary } from "./ddBlurbs.content/allSuttasPaliNameDictionary.js";

export default defineContentScript({
  matches: ["<all_urls>"],
  excludeMatches: ["*://index.readingfaithfully.org/*"],
  main() {
    console.info("💬 Sutta blurbs displayed on hover");

    function caseify(lowercaseId: string) {
      let casedId = lowercaseId.replace("snp", "Snp").replace("sn", "SN").replace("dn", "DN").replace("mn", "MN").replace("an", "AN").replace("kp", "Kp").replace("dhp", "Dhp").replace("ud", "Ud").replace("iti", "Iti").replace("vv", "VV").replace("pv", "Pv").replace("thag", "Thag").replace("thig", "Thig");
      return casedId;
    }

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
      toast.innerHTML = message;
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
      const target = event.target as HTMLElement;
      const anchor = target.closest("a") as HTMLAnchorElement; // Find the nearest <a> element

      if (anchor && anchor.href.includes("suttacentral.net") && !anchor.classList.contains("sc")) {
        hoveringLink = true;
        const idMatch = anchor.href.match(/suttacentral\.net\/([^\/]+)/);
        if (idMatch) {
          const id = idMatch[1]; // Extract the ID from the URL
          const blurb = blurbs[id]; // Look up the message from blurbs.js
          const casedId = caseify(id);
          const name: string = allSuttasPaliNameDictionary[casedId];
          const message = `<em><strong>${casedId.replace(/(\d)/, " $1")} ${name}</strong></em> ${blurb}`;
          if (blurb) {
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
