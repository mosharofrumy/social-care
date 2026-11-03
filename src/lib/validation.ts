export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
