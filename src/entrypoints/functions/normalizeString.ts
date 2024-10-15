export default function normalizeString(str) {
  return str
    .normalize("NFD") // Decompose diacritics
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[\s,;“”'"’/()-]/g, "") // Remove spaces and punctuation
    .toLowerCase();
}
