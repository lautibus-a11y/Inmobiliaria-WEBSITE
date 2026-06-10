import { useEffect, useRef, useState } from 'react';

/**
 * Returns a ref and a boolean that becomes true once the element enters the viewport.
 * Used on mobile to trigger CSS @keyframe animations (compositor thread)
 * instead of Framer Motion JS animations (main thread).
 */
export function useOnScreen(rootMargin = '0px 0px -40px 0px') {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return [ref, isVisible] as const;
}
