export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    console.info("⌨️ 'l' to copy markdown link is active");
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      // Check if the 'l' key is pressed
      if (event.key === "l" && !isInputFocused()) {
        const pageTitle = document.title;
        const cleanedPageTitle = pageTitle.replace(":", "").split("—")[0];
        const pageUrl = window.location.href.split("?")[0];
        const markdownLink = `[${cleanedPageTitle}](${pageUrl})`;

        navigator.clipboard
          .writeText(markdownLink)
          .then(() => {
            showToastNotification("Markdown link copied to clipboard!");
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
