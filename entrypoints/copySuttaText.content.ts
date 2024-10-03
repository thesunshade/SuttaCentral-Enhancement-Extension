import isInputFocused from "./functions/isInputFocused";

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    console.info("⌨️ 'c' to copy text of sutta is active");
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      // Check if the 'c' key is pressed
      if (event.key === "c" && !isInputFocused()) {
        // Select the <main> element
        const mainElement = document.querySelector("article");

        // Get the inner text
        if (!mainElement) {
          console.warn("No main element found in the document.");
          return null;
        }
        const innerText = mainElement.innerText;

        // Log the inner text to the console

        navigator.clipboard
          .writeText(innerText)
          .then(() => {
            showToastNotification("Sutta text copied to clipboard!");
          })
          .catch(err => {
            console.error("Failed to copy: ", err);
          });
      }
    });

    // Function to display a temporary notification on the page
    function showToastNotification(message: string) {
      const toast = document.createElement("div");
      toast.textContent = message;
      toast.style.position = "fixed";
      toast.style.bottom = "20px";
      toast.style.right = "20px";
      toast.style.padding = "10px 20px";
      toast.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      toast.style.color = "#fff";
      toast.style.borderRadius = "5px";
      toast.style.zIndex = "10000";
      document.body.appendChild(toast);

      // Remove the toast after 3 seconds
      setTimeout(() => {
        toast.remove();
      }, 3000);
    }
  },
});
