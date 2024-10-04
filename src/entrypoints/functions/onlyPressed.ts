export default function onlyPressed(event: KeyboardEvent, key: string): boolean {
  return event.key === key && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey;
}
