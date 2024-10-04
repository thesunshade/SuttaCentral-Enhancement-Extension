import { blurbs } from "./ddBlurbs.content/blurbs.js";
import { allSuttasPaliNameDictionary } from "./ddBlurbs.content/allSuttasPaliNameDictionary.js";

export default defineContentScript({
  matches: ["<all_urls>"],
  excludeMatches: ["*://index.readingfaithfully.org/*", "*://sutta.readingfaithfully.org/*"],
  main() {
    console.info("💬 Sutta blurbs displayed on hover");

    function caseify(lowercaseId: string) {
      let casedId = lowercaseId.replace("snp", "Snp").replace("sn", "SN").replace("dn", "DN").replace("mn", "MN").replace("an", "AN").replace("kp", "Kp").replace("dhp", "Dhp").replace("ud", "Ud").replace("iti", "Iti").replace("vv", "VV").replace("pv", "Pv").replace("thag", "Thag").replace("thig", "Thig");
      return casedId;
    }

    let toastTimeout: NodeJS.Timeout | null = null;
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
      toast.style.maxWidth = "300px";
      document.body.appendChild(toast);

      // Detect mouse entering and leaving the toast
      toast.addEventListener("mouseenter", () => {
        if (hideTimeout) clearTimeout(hideTimeout); // Prevent hiding when entering toast
      });
      toast.addEventListener("mouseleave", () => {
        hideToastWithDelay(toast); // Hide when leaving toast
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
        clearTimeout(toastTimeout); // Clear timeout if hiding early
        toastTimeout = null;
      }
    };

    const hideToastWithDelay = (toast: HTMLElement) => {
      hideTimeout = setTimeout(() => hideToast(toast), 100); // Small delay before hiding
    };

    // Initialize the toast
    const toast = createToast();

    // Event listener for link hover
    document.addEventListener("mouseover", event => {
      const target = event.target as HTMLElement;
      const anchor = target.closest("a") as HTMLAnchorElement;

      if (anchor && anchor.href.includes("suttacentral.net") && !anchor.classList.contains("sc")) {
        const idMatch = anchor.href.match(/suttacentral\.net\/([^\/]+)/);
        if (idMatch) {
          const id = idMatch[1];
          const blurb = blurbs[id];
          const casedId = caseify(id);
          const name: string = allSuttasPaliNameDictionary[casedId];
          const message = `<em><strong>${casedId.replace(/(\d)/, " $1")} ${name}</strong></em> ${blurb}`;
          if (blurb) {
            toastTimeout = setTimeout(() => showToast(toast, message), 400);
          }
        }
      }
    });

    // Listener to detect exiting the <a> tag and its children
    document.addEventListener("mouseout", event => {
      const target = event.target as HTMLElement;
      if (target.tagName === "A" || target.closest("a")) {
        hideToastWithDelay(toast);
      }
    });
  },
});
