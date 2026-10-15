'use client';

import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const arrowRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return;

    const arrow = arrowRef.current;
    const label = labelRef.current;
    if (!arrow || !label) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let lastRx = rx;
    let lastRy = ry;
    let appliedScale = 1;
    let frameId: number;
    let moved = false;

    // Opaque background colour an element shows, walking up past transparent ancestors.
    const bgOf = (el: Element | null) => {
      for (; el; el = el.parentElement) {
        const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
        if (m && (m[3] === undefined || Number(m[3]) > 0.5)) return m.slice(0, 3).map(Number);
      }
      return null;
    };
    // near-black only: every channel low (a saturated blue is dark too, but not black)
    const isDark = (rgb: number[] | null) => !!rgb && Math.max(...rgb) < 70;

    // The circle turns blue as soon as any part of it touches something black:
    // sample its centre and four points on its edge.
    const RING_R = 6; // matches .cursor-ring size
    const touchesDark = (x: number, y: number) =>
      [[0, 0], [RING_R, 0], [-RING_R, 0], [0, RING_R], [0, -RING_R]].some(([dx, dy]) =>
        isDark(bgOf(document.elementFromPoint(x + dx, y + dy))),
      );

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      moved = true;
      const isView = document.body.classList.contains('cur-view');
      label.style.transform = `translate(${mx + 20}px,${my}px) translate(0,-50%) scale(${isView ? 1 : 0.4})`;
    };

    const loop = () => {
      rx += (mx - rx) * 0.22;
      ry += (my - ry) * 0.22;

      const dx = rx - lastRx;
      const dy = ry - lastRy;
      lastRx = rx;
      lastRy = ry;
      const speed = Math.sqrt(dx * dx + dy * dy);

      const targetScale = speed > 0.4 ? 0.92 : 1;
      appliedScale += (targetScale - appliedScale) * 0.2;

      arrow.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%) rotate(-38deg) scale(${appliedScale})`;

      // at most once per frame, and only while the circle is showing
      if (moved && document.body.classList.contains('cur-hover')) {
        moved = false;
        document.body.classList.toggle('cur-on-dark', touchesDark(rx, ry));
      }

      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);

    const hoverSel = '[data-cursor]';
    const interactiveSel =
      'a, button, [role="button"], input, select, textarea, label, summary, [data-cursor], .chip, .pill, .card, .work';

    const onMouseOver = (e: MouseEvent) => {
      // mouseover fires on every element entered, so this also clears it when leaving one
      document.body.classList.toggle('cur-hover', !!(e.target as Element).closest(interactiveSel));

      const t = (e.target as Element).closest(hoverSel);
      if (!t) return;
      if (t.getAttribute('data-cursor') === 'view') {
        document.body.classList.add('cur-view');
        label.textContent = t.getAttribute('data-label') || 'View';
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const t = (e.target as Element).closest(hoverSel);
      if (!t) return;
      document.body.classList.remove('cur-view');
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  return (
    <>
      <div className="cursor-arrow" ref={arrowRef}>
        <span className="cursor-ring" />
        <svg viewBox="0 0 50 54" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
            fill="black"
          />
          <path
            d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999 40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z"
            stroke="white"
            strokeWidth="2.25825"
          />
        </svg>
      </div>
      <div className="cursor-label" ref={labelRef} />
    </>
  );
}
