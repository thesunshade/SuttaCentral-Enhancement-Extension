import isInputFocused from "./functions/isInputFocused";
import onlyPressed from "./functions/onlyPressed";
import { createQrCodePopup, closeQrPopup, isQrPopupOpen } from "./qrCode.content/qrPopup";

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    chrome.storage.sync.get("qrCode", data => {
      const isEnabled = data["qrCode"] === "true"; // Convert to boolean
      if (!isEnabled) {
        console.info("❌ QR Code generator is disabled");
        return; // Exit if the setting is not enabled
      }

      console.info("📱 'q' to copy QR code generator active");

      document.addEventListener("keydown", (event: KeyboardEvent) => {
        if (onlyPressed(event, "q") && !isInputFocused()) {
          const url = window.location.href;
          if (isQrPopupOpen()) {
            closeQrPopup(); // Close popup if it's already open
          } else {
            createQrCodePopup(url, closeQrPopup); // Create popup if it's closed
          }
        }
      });

      document.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key === "Escape" && isQrPopupOpen()) {
          closeQrPopup(); // Close popup on pressing Escape key
        }
      });
    });
  },
});
