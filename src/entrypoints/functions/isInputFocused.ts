export default function isInputFocused(): boolean {
  function getDeepActiveElement(element: Document | ShadowRoot): Element | null {
    const activeElement = element.activeElement;

    if (activeElement?.shadowRoot) {
      // Recursively check for active element inside shadow root
      return getDeepActiveElement(activeElement.shadowRoot);
    }

    return activeElement;
  }

  // Start by getting the active element, traversing shadow roots if necessary
  const activeElement = getDeepActiveElement(document);

  // console.log("Active element:", activeElement); // Log the detected active element

  // Check if the active element is an input, textarea, or contenteditable element
  const isFocused = activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement || activeElement instanceof HTMLSelectElement || activeElement instanceof HTMLButtonElement || (activeElement instanceof HTMLElement && activeElement.isContentEditable);

  // console.log("Is input focused:", isFocused); // Log the result of the focus check
  return isFocused;
}
