import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind + clsx classes safely.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * ✅ Base path configuration (for Vite)
 * Reads from:
 *   VITE_BASE_PATH
 *   VITE_API_BASE_URL
 */
export const BASE_PATH = (() => {
  const envBase = import.meta.env?.VITE_BASE_PATH;
  // Use empty string if undefined or "/"
  if (!envBase || envBase === "/") return "";
  return envBase;
})();

/**
 * Function to prefix routes with BASE_PATH.
 */
export function withBasePath(path: string): string {
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${BASE_PATH}/${normalizedPath}`;
}

/**
 * Hook-like helper to match old useWouterBase()
 */
export function useBasePath() {
  return { base: BASE_PATH };
}
