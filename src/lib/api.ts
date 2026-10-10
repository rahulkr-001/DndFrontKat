
/**
 * Browser API client for the standalone frontend.
 *
 * Browser requests stay on the frontend origin.
 * next.config.ts forwards /api/* to the backend.
 */

export const API_BASE_URL = '';

/**
 * Always return a same-origin API path.
 */
export function getApiUrl(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Unified fetch helper for cookie-based authentication.
 */
export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(options.headers || {});

  if (
    options.body != null &&
    !(options.body instanceof FormData) &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(getApiUrl(path), {
    ...options,
    headers,
    credentials: 'same-origin',
  });
}
