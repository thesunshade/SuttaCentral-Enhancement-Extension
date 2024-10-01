export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    console.info("⌨️ 'u' to copy bare url is active");
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "u" && !isInputFocused()) {
        const url = window.location.href.split("?")[0];

        navigator.clipboard
          .writeText(url)
          .then(() => {
            showToastNotification("Url copied to clipboard!");
          })
          .catch(err => {
            console.error("Failed to copy: ", err);
          });
      }
    });

    function isInputFocused(): boolean {
      const activeElement = document.activeElement;
      return activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement;
    }

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
