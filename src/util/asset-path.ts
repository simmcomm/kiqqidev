/**
 * Used for fetching static files (from CDN)
 * @param segments
 */
import { CONTENT_ENDPOINT } from 'boot/app';

export function assetPath(...segments: string[]): string {
  const url = new URL(CONTENT_ENDPOINT);

  if (segments.length > 0) {
    url.pathname = [url.pathname, ...segments]
      .filter((s) => s.length > 0)
      .join('/')
      .replace(/\/+/g, '/');
  }

  return url.toString();
}
