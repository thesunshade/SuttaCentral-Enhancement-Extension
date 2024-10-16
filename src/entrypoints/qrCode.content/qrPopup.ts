import QrCreator from "qr-creator";
import showToastNotification from "../functions/showToastNotification";

let popup: HTMLDivElement | null = null;

export function createQrCodePopup(url: string, closePopup: () => void) {
  popup = document.createElement("div");
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

  const qrCodeDiv = document.createElement("div");
  qrCodeDiv.id = "qr-code";

  const urlText = document.createElement("p");
  urlText.innerHTML = `
    <div class="qr-url-area">
      <div class="qr-url-label">QR code for:</div>
      <div class="qr-url">${url}</div>
    </div>`;
  popup.appendChild(urlText);

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.classList.add("qr-button");
  closeButton.addEventListener("click", closePopup);

  const copyButton = document.createElement("button");
  copyButton.textContent = "Copy QR Code";
  copyButton.classList.add("qr-button");

  const saveButton = document.createElement("button");
  saveButton.textContent = "Save QR Code";
  saveButton.classList.add("qr-button");

  const qrButtonArea = document.createElement("div");
  qrButtonArea.classList.add("qr-button-area");
  qrButtonArea.appendChild(copyButton);
  qrButtonArea.appendChild(saveButton);
  qrButtonArea.appendChild(closeButton);

  popup.appendChild(qrCodeDiv);
  popup.appendChild(qrButtonArea);

  document.body.appendChild(popup);

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

  const qrCanvas = qrCodeDiv.querySelector("canvas");

  copyButton.addEventListener("click", () => copyQrCodeToClipboard(qrCanvas));
  saveButton.addEventListener("click", () => saveQrCodeAsImage(qrCanvas));

  // Close the popup when clicking outside of it
  document.addEventListener("click", event => {
    if (popup && !popup.contains(event.target as Node)) {
      closePopup();
    }
  });
}

export function closeQrPopup() {
  if (popup && popup.parentElement) {
    document.body.removeChild(popup);
    popup = null;
  }
}

export function isQrPopupOpen(): boolean {
  return popup !== null;
}

function copyQrCodeToClipboard(qrCanvas: HTMLCanvasElement | null) {
  if (qrCanvas) {
    qrCanvas.toBlob(blob => {
      if (blob) {
        const clipboardItem = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([clipboardItem]).then(() => {
          showToastNotification("QR code copied to clipboard!");
        });
      } else {
        alert("Failed to convert QR code to blob.");
      }
    });
  }
}

function saveQrCodeAsImage(qrCanvas: HTMLCanvasElement | null) {
  if (qrCanvas) {
    const image = qrCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "qr-code.png";
    link.click();
  }
}
