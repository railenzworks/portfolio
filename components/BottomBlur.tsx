'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

// Progressive blur band at the bottom edge. It fades out as the page
// reaches its end so the footer is never blurred.
export function BottomBlur() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const remaining = doc.scrollHeight - (window.scrollY + window.innerHeight);
      const fade = Math.min(1, Math.max(0, remaining / el.offsetHeight));
      el.style.opacity = String(fade);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return (
    <div className="bottom-blur" aria-hidden="true" ref={ref}>
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}
