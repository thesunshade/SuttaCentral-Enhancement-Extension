export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });

  // Add this to check if the script is loaded
  console.log("Background script loaded");
});
