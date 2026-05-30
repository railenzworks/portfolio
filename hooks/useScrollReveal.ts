'use client';

import { useEffect, useRef } from 'react';

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>() {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    const els = container.querySelectorAll('.reveal, .clip, .line-mask');
    els.forEach((el) => {
      if (!el.classList.contains('in')) io.observe(el);
    });

    // Stagger groups
    container.querySelectorAll('[data-stagger]').forEach((g) => {
      Array.from(g.children).forEach((c, i) => {
        (c as HTMLElement).style.transitionDelay = i * 0.07 + 's';
      });
    });

    return () => io.disconnect();
  }, []);

  return containerRef;
}
