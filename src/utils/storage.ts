/**
 * Safe LocalStorage wrapper to prevent ReferenceError in non-browser/SSR/iframe environments
 */

export function getStorageItem(key: string): string | null {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return null;
  }
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

export function setStorageItem(key: string, value: string): void {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return;
  }
  try {
    localStorage.setItem(key, value);
  } catch (e) {}
}

export function removeStorageItem(key: string): void {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return;
  }
  try {
    localStorage.removeItem(key);
  } catch (e) {}
}
