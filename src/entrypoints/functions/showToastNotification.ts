// Function to display a temporary notification on the page

export default function showToastNotification(message: string) {
  const toast = document.createElement("div");
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.padding = "10px 20px";
  toast.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
  toast.style.color = "#fff";
  toast.style.borderRadius = "5px";
  toast.style.zIndex = "10000";
  toast.style.display = "flex";
  toast.style.alignItems = "center";

  document.body.appendChild(toast);

  // Create and style the icon element
  const icon = document.createElement("img");
  icon.src = chrome.runtime.getURL("icon/96.png");
  icon.style.width = "18px";
  icon.style.height = "18px";
  icon.style.marginRight = "10px";

  // Append icon and message to the toast
  toast.appendChild(icon);
  toast.appendChild(document.createTextNode(message));

  // Remove the toast after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
