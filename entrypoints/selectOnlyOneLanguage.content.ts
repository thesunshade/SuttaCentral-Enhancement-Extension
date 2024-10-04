import background from "./background";

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    console.info("✂️ selecting one language alt");

    // Initial state
    let isRootDisabled = false;
    let isTranslationDisabled = false;

    // Function to toggle user-select on specified elements
    function setUserSelectNone(selector: string, disable: boolean): void {
      const elements = document.querySelectorAll<HTMLElement>(selector);
      elements.forEach(element => {
        if (disable) {
          element.style.userSelect = "none";
        } else {
          element.style.removeProperty("user-select"); // Restore default behavior
        }
      });
    }

    // Function to show the toast message
    function showToast(message: string): void {
      const toast = (document.getElementById("selection-toast") as HTMLElement) || createToast();
      toast.innerHTML = message;
      toast.style.display = "block";
    }

    // Function to create the toast if it doesn't exist
    function createToast(): HTMLElement {
      const toast = document.createElement("div");
      toast.id = "selection-toast";
      toast.style.position = "fixed";
      toast.style.textAlign = "center";
      toast.style.bottom = "20px";
      toast.style.left = "50%";
      toast.style.transform = "translateX(-50%)";
      toast.style.backgroundColor = "#e62c2c";
      toast.style.color = "black";
      toast.style.padding = "10px 20px";
      toast.style.borderRadius = "5px";
      toast.style.zIndex = "1000";
      toast.style.boxShadow = "4.5px 4.5px 10.6px rgba(0, 0, 0, 0.47), 12.5px 12.5px 19.3px rgba(0, 0, 0, 0.047), 30.1px 30.1px 27.2px rgba(0, 0, 0, 0.038), 100px 100px 59px rgba(0, 0, 0, 0.07)";
      toast.style.display = "none"; // Initially hidden
      document.body.appendChild(toast);
      return toast;
    }

    // Function to update selection states and manage the toast display
    function updateSelectionStates() {
      setUserSelectNone(".root", isRootDisabled);
      setUserSelectNone(".translation", isTranslationDisabled);

      if (isRootDisabled) {
        showToast("Selecting only translation.<br>Press <kbd style='background-color:black;color:white;border-radius:3px;padding:0 2px 2px'>.</kbd> to enable selecting root again.");
      } else if (isTranslationDisabled) {
        showToast("Selecting only root. Press <kbd style='background-color:black;color:white;border-radius:3px;padding:0 2px 4px'>,</kbd> to enable selecting translation again.");
      } else {
        const toast = document.getElementById("selection-toast") as HTMLElement;
        if (toast) toast.style.display = "none"; // Hide toast when both are enabled
      }
    }

    // Event listener for the keydown event
    document.addEventListener("keydown", event => {
      if (event.key === ".") {
        // If root is disabled, re-enable it. Otherwise, disable root and clear translation if necessary.
        if (isRootDisabled) {
          isRootDisabled = false;
        } else {
          isRootDisabled = true;
          isTranslationDisabled = false; // Clear translation selection if active
        }
        updateSelectionStates();
      } else if (event.key === ",") {
        // If translation is disabled, re-enable it. Otherwise, disable translation and clear root if necessary.
        if (isTranslationDisabled) {
          isTranslationDisabled = false;
        } else {
          isTranslationDisabled = true;
          isRootDisabled = false; // Clear root selection if active
        }
        updateSelectionStates();
      }
    });

    // Initial state setup: Allow both selections
    updateSelectionStates();
  },
});
