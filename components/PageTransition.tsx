'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function PageTransition() {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    // Entry reveal on first load
    overlay.style.transition = 'none';
    overlay.style.transform = 'scaleY(1)';
    overlay.style.transformOrigin = 'top';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.style.transition = 'transform 0.6s var(--ease)';
        overlay.style.transform = 'scaleY(0)';
      });
    });
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      // Reveal after navigation (cover was set by TransitionLink)
      requestAnimationFrame(() => {
        overlay.style.transition = 'none';
        overlay.style.transform = 'scaleY(1)';
        overlay.style.transformOrigin = 'top';
        requestAnimationFrame(() => {
          overlay.style.transition = 'transform 0.6s var(--ease)';
          overlay.style.transform = 'scaleY(0)';
        });
      });
    }
  }, [pathname]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const handler = (e: Event) => {
      const { accent } = (e as CustomEvent).detail;
      if (accent) overlay.style.setProperty('--accent', accent);
      overlay.style.transition = 'transform 0.55s var(--ease)';
      overlay.style.transformOrigin = 'bottom';
      overlay.style.transform = 'scaleY(1)';
    };

    window.addEventListener('page-transition-start', handler);
    return () => window.removeEventListener('page-transition-start', handler);
  }, []);

  return (
    <div className="transition" ref={overlayRef}>
      <div className="t-word">Railenz</div>
    </div>
  );
}
