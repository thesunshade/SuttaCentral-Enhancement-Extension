export default defineBackground(() => {
  console.log("🔍 search background running", { id: browser.runtime.id });
});
