import thumbnailsMap from '../data/thumbnails.json';
import { Property } from '../types';

const thumbs = thumbnailsMap as Record<string, string>;
let hasScheduledPreload = false;

/**
 * Returns the optimized 720px card thumbnail path when available,
 * gracefully falling back to `property.image`.
 */
export function getCardImage(property: Property): string {
  return thumbs[property.id] || property.image;
}

/**
 * Gently preloads and decodes all card thumbnails in browser idle time
 * so tab switching renders cards immediately without decode stutter.
 */
export function scheduleCardThumbnailsPreload(): void {
  if (hasScheduledPreload || typeof window === 'undefined') return;
  hasScheduledPreload = true;

  const urls = Object.values(thumbs);
  if (urls.length === 0) return;

  const runPreload = () => {
    let index = 0;
    const concurrency = 4;

    const loadNext = () => {
      if (index >= urls.length) return;
      const url = urls[index++];
      const img = new Image();
      img.decoding = 'async';
      img.src = url;
      const advance = () => loadNext();
      if (typeof img.decode === 'function') {
        img.decode().then(advance).catch(advance);
      } else {
        img.onload = advance;
        img.onerror = advance;
      }
    };

    for (let i = 0; i < Math.min(concurrency, urls.length); i++) {
      loadNext();
    }
  };

  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  };
  if (typeof w.requestIdleCallback === 'function') {
    w.requestIdleCallback(runPreload, { timeout: 2500 });
  } else {
    window.setTimeout(runPreload, 1500);
  }
}

