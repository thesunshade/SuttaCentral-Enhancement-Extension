import QrCreator from "qr-creator";
import "./qrCode.content/qrCode.css";
import isInputFocused from "./functions/isInputFocused";
import showToastNotification from "./functions/showToastNotification";
import onlyPressed from "./functions/onlyPressed";

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    console.info("📱 'q' to copy QR code generator active ");

    document.addEventListener("keydown", (event: KeyboardEvent) => {
      if (onlyPressed(event, "q") && !isInputFocused()) {
        const url = window.location.href;
        createQrCodePopup(url);
      }
    });

    function createQrCodePopup(url: string) {
      // Create the popup div
      const popup = document.createElement("div");
      popup.id = "qr-popup";
      popup.style.position = "fixed";
      popup.style.top = "50%";
      popup.style.left = "50%";
      popup.style.transform = "translate(-50%, -50%)";
      popup.style.background = "#fff";
      popup.style.padding = "20px";
      popup.style.borderRadius = "8px";
      popup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
      popup.style.zIndex = "1000"; // Ensures it appears on top

      // Create the QR code container div
      const qrCodeDiv = document.createElement("div");
      qrCodeDiv.id = "qr-code";

      // Display the URL
      const urlText = document.createElement("p");
      urlText.innerHTML = `
    <div class="qr-url-area">
        <div class="qr-url-label">QR code for:
        </div>
        <div class="qr-url">${url}
        </div>
    </div>`;
      popup.appendChild(urlText);

      // Create a close button
      const closeButton = document.createElement("button");
      closeButton.textContent = "Close";
      closeButton.classList.add("qr-button");

      // Add close functionality to the button
      closeButton.addEventListener("click", () => {
        closePopup();
      });

      // Create a copy button
      const copyButton = document.createElement("button");
      copyButton.textContent = "Copy QR Code";
      copyButton.classList.add("qr-button");

      // Create save button
      const saveButton = document.createElement("button");
      saveButton.textContent = "Save QR Code";
      saveButton.classList.add("qr-button");

      const qrButtonArea = document.createElement("div");
      qrButtonArea.classList.add("qr-button-area");
      qrButtonArea.appendChild(copyButton);
      qrButtonArea.appendChild(saveButton);
      qrButtonArea.appendChild(closeButton);

      // Append QR code div and buttons
      popup.appendChild(qrCodeDiv);
      popup.appendChild(qrButtonArea);

      // Append the popup to the body
      document.body.appendChild(popup);

      // Generate the QR code
      QrCreator.render(
        {
          text: url,
          radius: 0, // Adjust as needed
          ecLevel: "H", // Error correction level
          fill: "black", // Color of the QR code
          background: "white",
          size: 128, // Size of the QR code in pixels
        },
        qrCodeDiv
      );

      // Get the canvas element to be used for copying/saving
      const qrCanvas = qrCodeDiv.querySelector("canvas");

      // Copy QR code to clipboard
      copyButton.addEventListener("click", () => {
        if (qrCanvas) {
          setTimeout(() => {
            qrCanvas.toBlob(blob => {
              if (blob) {
                const clipboardItem = new ClipboardItem({ "image/png": blob });
                navigator.clipboard.write([clipboardItem]).then(() => showToastNotification("QR code copied to clipboard!"));
              } else {
                alert("Failed to convert QR code to blob.");
              }
            });
          }, 100); // Adjust timeout if necessary
        }
      });

      // Save QR code as image
      saveButton.addEventListener("click", () => {
        if (qrCanvas) {
          const image = qrCanvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = image;
          link.download = "qr-code.png";
          link.click();
        }
      });

      // Close the popup when clicking outside of it
      document.addEventListener("click", event => {
        if (!popup.contains(event.target as Node)) {
          closePopup();
        }
      });

      // Close the popup when pressing the Escape key
      document.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          closePopup();
        }
      });

      // Function to close the popup
      function closePopup() {
        if (popup && popup.parentElement) {
          document.body.removeChild(popup);
        }
      }
    }
  },
});
