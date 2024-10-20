// When root text and translatins are displayed, normally text selection includes both.
// This function allows the user to only select one or the other.

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    console.info("✂️ selecting one language alt");

    const keyStyle = `margin: 0px 0.1em;
      padding: 0.1em 0.4em;
      font-weight: bold;
      border-radius: 3px;
      border: 1px solid rgb(204, 204, 204);
      color: rgb(51, 51, 51);
      font-family: Arial,Helvetica,sans-serif;
      font-size: 1rem;
      display: inline-block;
      box-shadow: 0px 1px 0px rgba(0,0,0,0.2), inset 0px 0px 0px 2px #ffffff;
      background-color: rgb(247, 247, 247);
      -moz-box-shadow: 0 1px 0px rgba(0, 0, 0, 0.2), 0 0 0 2px #ffffff inset;
      -webkit-box-shadow: 0 1px 0px rgba(0, 0, 0, 0.2), 0 0 0 2px #ffffff inset;
      -moz-border-radius: 3px;
      -webkit-border-radius: 3px;
      text-shadow: 0 1px 0 #fff;`;

    // Initial state
    let isRootDisabled = false;
    let isTranslationDisabled = false;
    let hotkeyRootEnabled = false;
    let hotkeyTranslationEnabled = false;

    // Load settings from chrome storage
    chrome.storage.sync.get(["selectOnlyRoot", "selectOnlyTranslation"], data => {
      hotkeyRootEnabled = data.selectOnlyRoot === "true"; // Enable or disable root hotkey
      hotkeyTranslationEnabled = data.selectOnlyTranslation === "true"; // Enable or disable translation hotkey
    });

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
      toast.style.maxWidth = "20rem";
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
        showToast(`Selecting only translation.<br>Press <kbd style='${keyStyle}'>.</kbd> to enable selecting root again.`);
      } else if (isTranslationDisabled) {
        showToast(`Selecting only root. Press <kbd style='${keyStyle}'>,</kbd> to enable selecting translation again.`);
      } else {
        const toast = document.getElementById("selection-toast") as HTMLElement;
        if (toast) toast.style.display = "none"; // Hide toast when both are enabled
      }
    }

    // Event listener for the keydown event
    document.addEventListener("keydown", event => {
      if (event.key === "." && hotkeyTranslationEnabled) {
        // If root is disabled, re-enable it. Otherwise, disable root and clear translation if necessary.
        if (isRootDisabled) {
          isRootDisabled = false;
        } else {
          isRootDisabled = true;
          isTranslationDisabled = false; // Clear translation selection if active
        }
        updateSelectionStates();
      } else if (event.key === "," && hotkeyRootEnabled) {
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
