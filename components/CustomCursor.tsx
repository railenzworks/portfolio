'use client';

import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let frameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
      const isView = document.body.classList.contains('cur-view');
      label.style.transform = `translate(${mx}px,${my - 44}px) translate(-50%,-50%) scale(${isView ? 1 : 0.4})`;
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);

    const hoverSel = 'a,button,[data-cursor]';

    const onMouseOver = (e: MouseEvent) => {
      const t = (e.target as Element).closest(hoverSel);
      if (!t) return;
      const mode = t.getAttribute('data-cursor');
      if (mode === 'view') {
        document.body.classList.add('cur-view');
        label.textContent = t.getAttribute('data-label') || 'View';
      } else {
        document.body.classList.add('cur-hover');
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const t = (e.target as Element).closest(hoverSel);
      if (!t) return;
      document.body.classList.remove('cur-hover', 'cur-view');
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
      <div className="cursor" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />
      <div className="cursor-label" ref={labelRef} />
    </>
  );
}
