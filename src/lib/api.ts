/**
 * API Client Configuration for Standalone Frontend
 * Connects seamlessly to the decoupled backend service.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (typeof window !== 'undefined' ? '' : 'http://localhost:5000');

/**
 * Returns full API URL for a given relative path.
 * When NEXT_PUBLIC_API_BASE_URL is set, prefixes it; otherwise falls back to /api route or localhost:5000.
 */
export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}${cleanPath}`;
  }
  return cleanPath;
}

/**
 * Unified fetch helper with credentials included for cookie-based authentication
 */
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const url = getApiUrl(path);
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Ensures session cookies are sent across domains
  });
}
