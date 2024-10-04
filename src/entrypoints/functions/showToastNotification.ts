// Function to display a temporary notification on the page
export default function showToastNotification(message: string) {
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
