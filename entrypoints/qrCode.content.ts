import QrCreator from "qr-creator";

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    console.info("📱 'q' to copy QR code generator active ");

    document.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "q" && !isInputFocused()) {
        const url = window.location.href;
        createQrCodePopup(url);
      }
    });

    function isInputFocused(): boolean {
      const activeElement = document.activeElement;
      return activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement;
    }

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
      urlText.textContent = `QR Code for: ${url}`;
      urlText.style.wordBreak = "break-all"; // Ensure long URLs are wrapped
      popup.appendChild(urlText);

      // Create a close button
      const closeButton = document.createElement("button");
      closeButton.textContent = "Close";
      closeButton.style.marginTop = "10px";

      // Add close functionality to the button
      closeButton.addEventListener("click", () => {
        document.body.removeChild(popup);
      });

      // Create a copy button
      const copyButton = document.createElement("button");
      copyButton.textContent = "Copy QR Code";
      copyButton.style.marginTop = "10px";
      copyButton.style.marginLeft = "10px";

      // Create save button
      const saveButton = document.createElement("button");
      saveButton.textContent = "Save QR Code";
      saveButton.style.marginTop = "10px";
      saveButton.style.marginLeft = "10px";

      // Append QR code div and buttons
      popup.appendChild(qrCodeDiv);
      popup.appendChild(copyButton);
      popup.appendChild(saveButton);
      popup.appendChild(closeButton);

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
                navigator.clipboard.write([clipboardItem]).then(
                  () => alert("QR code copied to clipboard!"),
                  () => alert("Failed to copy QR code.")
                );
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
    }
  },
});
