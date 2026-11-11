const SCROLL_STORAGE_KEY = 'inmobiliaria_home_scroll_y';
let inMemoryHomeScrollY: number | null = null;

export function saveHomeScrollPosition(y?: number): void {
  const scrollY = typeof y === 'number' ? y : window.scrollY;
  inMemoryHomeScrollY = scrollY;
  try {
    sessionStorage.setItem(SCROLL_STORAGE_KEY, String(scrollY));
  } catch {
    // ignore storage errors
  }
}

export function consumeHomeScrollPosition(): number | null {
  let y = inMemoryHomeScrollY;
  if (y === null) {
    try {
      const stored = sessionStorage.getItem(SCROLL_STORAGE_KEY);
      if (stored !== null) {
        const parsed = parseFloat(stored);
        if (!Number.isNaN(parsed)) y = parsed;
      }
    } catch {
      // ignore storage errors
    }
  }
  inMemoryHomeScrollY = null;
  try {
    sessionStorage.removeItem(SCROLL_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
  return y;
}

export function clearHomeScrollPosition(): void {
  inMemoryHomeScrollY = null;
  try {
    sessionStorage.removeItem(SCROLL_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
}

/**
 * Scrolls immediately to `top` bypassing CSS `html { scroll-behavior: smooth }`
 * so there is zero visible scrolling animation or jump.
 */
export function scrollInstantTo(top: number): void {
  const html = document.documentElement;
  const prevBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';
  window.scrollTo({ top, left: 0, behavior: 'instant' as ScrollBehavior });
  if (Math.abs(window.scrollY - top) > 2) {
    window.scrollTo(0, top);
  }
  requestAnimationFrame(() => {
    html.style.scrollBehavior = prevBehavior;
  });
}

