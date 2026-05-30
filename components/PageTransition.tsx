'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

function reveal(overlay: HTMLDivElement) {
  overlay.classList.add('cover');
  overlay.style.transition = 'none';
  overlay.style.transform = 'scaleY(1)';
  overlay.style.transformOrigin = 'top';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.style.transition = 'transform 0.6s var(--ease)';
      overlay.style.transform = 'scaleY(0)';
      setTimeout(() => overlay.classList.remove('cover'), 650);
    });
  });
}

export function PageTransition() {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const prevPathRef = useRef(pathname);

  // Entry reveal on first load
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    reveal(overlay);
  }, []);

  // Reveal after navigation
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      reveal(overlay);
    }
  }, [pathname]);

  // Cover on link click
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const handler = (e: Event) => {
      const { accent } = (e as CustomEvent).detail;
      if (accent) overlay.style.setProperty('--accent', accent);
      overlay.classList.add('cover');
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
