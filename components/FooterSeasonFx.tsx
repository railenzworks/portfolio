'use client';

import { useEffect, useRef } from 'react';
import { FooterFlock } from './FooterFlock';
import styles from './FooterSeasonFx.module.css';

// Decorative layer behind the footer's text: falling leaves (autumn), snow
// (winter), swallows or fireflies (spring) or sun rays or the Milky Way
// (summer). All four are rendered and
// CSS shows the one matching <html data-season>, so switching the season in
// SeasonPicker swaps the effect. "main" shows none.
//
// With the cursor over the footer (see useCursorFx):
//   summer day   - a patch of warm sunlight follows it
//   autumn day   - leaves are blown away from it
//   autumn night - it blows like wind: clouds near it speed up
//   winter       - snow swirls round it in a little eddy
//   spring day   - the flock wheels round it (FooterFlock)
//   spring night - fireflies gather round it
//   summer night - each star it passes over lights up a little
//                  (and a click calls up a shooting star through it)

// fixed pseudo-random layout so server and client markup match:
// [left %, delay s, duration s, size px, sway px]
const DROPS: [number, number, number, number, number][] = [
  [4, 0, 11, 18, 40], [12, 4.5, 14, 13, -30], [21, 1.8, 10, 22, 50],
  [30, 7, 13, 15, -45], [38, 2.6, 12, 19, 35], [47, 9, 15, 12, -25],
  [55, 0.9, 11, 21, 55], [63, 5.5, 13, 14, -40], [71, 3.2, 10, 17, 30],
  [79, 8.2, 14, 20, -50], [87, 1.2, 12, 13, 45], [95, 6.3, 11, 16, -35],
];

// spring and autumn nights, stars: [left %, top %, size px, twinkle delay s]
const STARS: [number, number, number, number][] = [
  [3, 12, 2, 0], [9, 38, 1.5, 1.2], [15, 8, 2.5, 2.4], [22, 27, 1.5, 0.6],
  [28, 55, 2, 3.1], [34, 15, 1.5, 1.8], [41, 42, 2.5, 0.3], [47, 6, 1.5, 2.7],
  [53, 30, 2, 1.1], [59, 60, 1.5, 3.4], [64, 18, 2.5, 0.9], [70, 45, 1.5, 2.1],
  [76, 10, 2, 1.5], [82, 34, 1.5, 3.8], [88, 20, 2.5, 0.4], [94, 50, 1.5, 2.9],
  [6, 70, 1.5, 1.7], [37, 75, 1.5, 0.2], [67, 80, 1.5, 2.2], [97, 8, 2, 3.3],
];

// spring night, fireflies: [left %, top %, delay s, drift duration s]
const FIREFLIES: [number, number, number, number][] = [
  [8, 62, 0, 9], [19, 80, 3, 12], [31, 58, 6, 10], [44, 85, 1.5, 13],
  [56, 66, 4.5, 11], [68, 78, 7, 9.5], [79, 60, 2.5, 12.5], [90, 82, 5.5, 10.5],
  [25, 40, 8, 14], [73, 35, 3.5, 11.5],
];

// chestnut leaf: long and narrow, saw-toothed edges, just the central vein
function Leaf() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 1.5L13.6 2.2L13.9 3.5L15.2 4.2L15 5.5L16.3 6.2L15.8 7.5L17 8.2L16.2 9.5L17.3 10.2L16.2 11.5L17.1 12.2L15.8 13.5L16.6 14.2L15 15.5L15.6 16.2L13.9 17.5L14.2 18.2L12.6 19.4L12.4 23H11.6L11.4 19.4L9.8 18.2L10.1 17.5L8.4 16.2L9 15.5L7.4 14.2L8.2 13.5L6.9 12.2L7.8 11.5L6.7 10.2L7.8 9.5L7 8.2L8.2 7.5L7.7 6.2L9 5.5L8.8 4.2L10.1 3.5L10.4 2.2Z"
        fill="currentColor"
        strokeLinejoin="round"
      />
      <path
        d="M12 2.5V20"
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="0.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// six arms, each with two pairs of side branches
function Flake() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 12L12 2M12 6.5L9.7 4.2M12 6.5L14.3 4.2M12 4L10.4 2.4M12 4L13.6 2.4M12 12L3.3 7M7.2 9.2L4.1 10.1M7.2 9.2L6.4 6.2M5.1 8L2.9 8.6M5.1 8L4.5 5.9M12 12L3.3 17M7.2 14.8L6.4 17.8M7.2 14.8L4.1 13.9M5.1 16L4.5 18.1M5.1 16L2.9 15.4M12 12L12 22M12 17.5L14.3 19.8M12 17.5L9.7 19.8M12 20L13.6 21.6M12 20L10.4 21.6M12 12L20.7 17M16.8 14.8L19.9 13.9M16.8 14.8L17.6 17.8M18.9 16L21.1 15.4M18.9 16L19.5 18.1M12 12L20.7 7M16.8 9.2L17.6 6.2M16.8 9.2L19.9 10.1M18.9 8L19.5 5.9M18.9 8L21.1 8.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// speed: multiplier on each drop's duration (lower = faster)
// (spring has no falling things: swallows by day, fireflies at night)
const FALLING = [
  { season: 'autumn', Shape: Leaf, speed: 0.7 },
  { season: 'winter', Shape: Flake, speed: 1 },
  { season: 'spring', Shape: null, speed: 1 },
] as const;

// autumn night, clouds: [top %, width cqw, delay s, drift duration s]
const CLOUDS: [number, number, number, number][] = [
  [4, 46, 0, 70], [22, 34, 30, 55], [-6, 38, 48, 85], [40, 52, 15, 95],
  [12, 28, 62, 60], [55, 40, 38, 80], [30, 44, 8, 100], [-2, 30, 22, 65],
  [48, 26, 52, 75],
];

// autumn night, cloud silhouettes (viewBox 0 0 300 100): long and low, an
// uneven top of soft bumps over a flatter base
const CLOUD_SHAPES = [
  'M10 70C20 58 40 56 55 60C62 44 85 38 100 46C112 30 140 28 155 40C168 34 185 36 192 46C210 40 232 46 238 56C258 54 280 60 290 70C270 78 240 76 220 80C190 84 160 78 130 82C100 86 70 80 45 82C30 80 15 76 10 70Z',
  'M5 66C25 60 45 62 60 58C75 50 95 50 108 55C125 44 150 46 162 54C180 50 200 52 215 58C235 55 260 58 295 64C275 70 250 70 230 74C200 78 175 72 150 76C120 80 90 74 65 76C40 76 20 72 5 66Z',
  'M20 72C28 60 48 56 62 62C68 46 90 36 110 42C122 26 152 24 166 38C176 30 196 34 200 48C218 46 236 54 240 64C255 64 268 68 274 74C250 80 220 78 195 82C165 86 135 80 105 84C75 86 45 82 20 72Z',
];

// winter night: a denser sky. Generated from a fixed seed, so server and
// client still agree: [left %, top %, size px, twinkle delay s]
const WINTER_STARS: [number, number, number, number][] = (() => {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: 70 }, () => [
    rnd() * 100,
    rnd() * 85,
    0.8 + rnd() * 1.9,
    rnd() * 4,
  ]);
})();

// winter night, mountain on the right (viewBox 0 0 400 180): a far ridge,
// the mountain itself, and the village lights scattered at its foot
const RIDGE = 'M0 180C30 178 60 166 90 150C115 138 145 120 175 118C210 104 240 110 270 100C310 92 350 104 400 96V180Z';
const MOUNTAIN = 'M40 180C70 168 95 150 120 138C140 128 152 112 168 96C180 82 190 64 204 46C210 38 216 34 222 40C232 50 240 62 252 66C262 70 270 64 280 72C296 86 312 100 334 112C356 124 380 132 400 138V180Z';
const VILLAGE: [number, number][] = [
  [118, 168], [126, 171], [131, 165], [139, 170], [146, 166],
  [236, 160], [243, 164], [249, 158], [256, 163], [262, 167],
  [318, 158], [326, 161], [333, 156], [372, 164], [380, 160],
  [188, 128], // a lone cabin up the slope
];

// summer night, the Milky Way as seen with the naked eye: no glow, just
// points. Laid out in the band's own box (which CSS tilts across the sky):
// u runs along it, v across it. Most points gather in clumps (star clouds)
// strung along the spine, the rest are a thinner scatter over the band, and
// a wandering dark lane (the Great Rift) is left mostly empty. Its density
// and faintness are what read as milky. [u %, v %, radius px, opacity, fill]
const MILKY_WAY: [number, number, number, number, string][] = (() => {
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const bell = () => rnd() + rnd() + rnd() - 1.5; // roughly -1.5..1.5, peaked at 0
  // still white to the eye, just faintly bluish or warm
  const tints = ['#fff', '#fff', '#e4ecff', '#edf2ff', '#ffeedd', '#fff4e8'];
  // the rift's centre line and half-width at u, only over the band's middle
  const inRift = (u: number, v: number) => {
    if (u < 22 || u > 82) return false;
    const mid = 50 + 5 * Math.sin(u * 0.11) + 3 * Math.sin(u * 0.29);
    const half = 3 + 3 * Math.sin(u * 0.07 + 1);
    return Math.abs(v - mid) < half;
  };
  const dots: [number, number, number, number, string][] = [];
  const add = (u: number, v: number) => {
    if (u < 0 || u > 100 || v < 0 || v > 100) return;
    if (inRift(u, v) && rnd() < 0.88) return;
    const r = 0.3 + rnd() ** 4 * 0.8;
    const o = 0.2 + rnd() ** 2 * 0.7;
    dots.push([+u.toFixed(1), +v.toFixed(1), +r.toFixed(2), +o.toFixed(2), tints[Math.floor(rnd() * tints.length)]]);
  };
  // star clouds: bigger and denser toward the band's middle
  for (let c = 0; c < 40; c++) {
    const cu = rnd() * 100;
    const cv = 50 + bell() * 9;
    const rich = 1 - Math.abs(cu - 50) / 60;
    const n = Math.round(6 + rich * 20 * rnd());
    const su = 1 + rnd() * 3;
    const sv = 2 + rnd() * 4.5;
    for (let i = 0; i < n; i++) add(cu + bell() * su, cv + bell() * sv);
  }
  // the thinner scatter in between
  for (let i = 0; i < 250; i++) add(rnd() * 100, 50 + bell() * 16);
  return dots;
})();

// summer night, the few brighter stars in the band that twinkle
const MILKY_WAY_BRIGHT: [number, number, number, number][] = (() => {
  let seed = 31;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: 30 }, () => [rnd() * 100, 50 + (rnd() + rnd() - 1) * 40, 1 + rnd() * 1.2, rnd() * 4]);
})();

// summer night, the sparser sky around the band
const SUMMER_STARS: [number, number, number, number][] = (() => {
  let seed = 23;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: 40 }, () => [rnd() * 100, rnd() * 95, 0.8 + rnd() * 1.6, rnd() * 4]);
})();

// summer night, shooting stars, each crossing the whole footer from just
// off its right edge: [top %, delay s, cycle s]
const METEORS: [number, number, number][] = [
  [8, 3, 14], [22, 10, 19],
];

// glint: the star lights up as the cursor passes (summer night)
function Stars({ list = STARS, glint }: { list?: [number, number, number, number][]; glint?: boolean }) {
  return list.map(([left, top, size, delay], i) => (
    <span
      key={i}
      data-glint={glint || undefined}
      className={styles.star}
      style={{
        left: `${left}%`,
        top: `${top}%`,
        ['--size' as string]: `${size}px`,
        animationDelay: `-${delay}s`,
      }}
    />
  ));
}

const sceneNow = () => {
  const root = document.documentElement;
  return `${root.dataset.season ?? 'main'}-${root.dataset.theme === 'dark' ? 'night' : 'day'}`;
};

// summer night: the glint colour for a star of this colour (#hex or rgb()).
// The stars are only faintly tinted; their glint shows the tint clearly
const glowOf = (color: string) => {
  const hex = color.match(/^#(\w\w?)(\w\w?)(\w\w?)$/);
  const [r, , b] = hex
    ? hex.slice(1).map((h) => parseInt(h.length === 1 ? h + h : h, 16))
    : (color.match(/\d+/g) ?? []).map(Number);
  if (b - r > 8) return '#a9c2ff';
  if (r - b > 8) return '#ffc58f';
  return '#fff';
};

// Tracks the cursor over the footer: sets --mx / --my (px, in the layer's
// box) and data-hover on the layer for the CSS glows, and while it's inside
// runs a frame loop that nudges the leaves, fireflies or clouds near it.
function useCursorFx() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fx = ref.current;
    const foot = fx?.parentElement;
    if (!fx || !foot) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let mx = 0;
    let my = 0;
    let raf = 0;
    let inside = false;
    const all = (sel: string) => fx.querySelectorAll<HTMLElement>(sel);

    // summer night: where each star is on screen (box-relative), re-measured
    // every so many frames, as the band only turns very slowly; and how lit
    // each one is (by index, 0..1), fading after the cursor has passed. The
    // stars themselves are never touched: restyling them would redraw the
    // whole filtered band. A small pool of glint dots is laid over them.
    let glints: { x: number; y: number; glow: string }[] = [];
    const levels = new Map<number, number>();
    let measuredAt = -Infinity;
    let frame = 0;

    const reset = () => {
      all('[data-push], [data-attract]').forEach((el) => (el.style.transform = ''));
    };

    const tick = () => {
      const box = fx.getBoundingClientRect();
      const scene = sceneNow();
      let settling = false;
      frame++;

      if (scene === 'summer-night') {
        // each star the cursor passes over lights up a little, brighter the
        // closer it is, then fades back
        if (frame - measuredAt > 30) {
          measuredAt = frame;
          // same DOM order every time, so the indices in levels still hold
          glints = Array.from(fx.querySelectorAll(`.${styles.summer} [data-glint]`), (el) => {
            const r = el.getBoundingClientRect();
            const color = el.getAttribute('fill') ?? getComputedStyle(el).backgroundColor;
            return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top, glow: glowOf(color) };
          });
        }
        levels.forEach((l, i) => (l > 0.03 ? levels.set(i, l - 0.03) : levels.delete(i)));
        if (inside) {
          // small, so only the stars right under the pointer light up
          const R = 16;
          glints.forEach((g, i) => {
            const dist = Math.hypot(g.x - mx, g.y - my);
            if (dist < R) levels.set(i, Math.max(levels.get(i) ?? 0, 1 - dist / R));
          });
        }
        // the brightest ones get a dot from the pool, the rest of it hides
        const lit = [...levels].sort((a, b) => b[1] - a[1]);
        all('[data-glint-dot]').forEach((dot, n) => {
          const [i, l] = lit[n] ?? [];
          if (i === undefined || l === undefined || !glints[i]) {
            dot.style.opacity = '0';
            return;
          }
          dot.style.transform = `translate(${glints[i].x}px, ${glints[i].y}px) scale(${0.6 + l * 0.5})`;
          dot.style.opacity = (l * 0.65).toFixed(2);
          dot.style.color = glints[i].glow;
        });
        if (levels.size) settling = true;
      } else if (scene === 'autumn-day') {
        // the leaf's falling box moves; its inner [data-push] gets the shove
        all(`.${styles.autumn} [data-push]`).forEach((el) => {
          const r = el.parentElement!.getBoundingClientRect();
          const dx = r.left + r.width / 2 - box.left - mx;
          const dy = r.top + r.height / 2 - box.top - my;
          const dist = Math.hypot(dx, dy) || 1;
          const R = 170;
          if (dist >= R) {
            el.style.transform = '';
            return;
          }
          const k = 1 - dist / R;
          el.style.transform = `translate(${(dx / dist) * k * 110}px, ${(dy / dist) * k * 110}px) rotate(${k * 120 * Math.sign(dx)}deg)`;
        });
      } else if (scene.startsWith('winter-')) {
        // snow swirls round the cursor: pushed out and swept sideways
        all(`.${styles.winter} [data-push]`).forEach((el) => {
          const r = el.parentElement!.getBoundingClientRect();
          const dx = r.left + r.width / 2 - box.left - mx;
          const dy = r.top + r.height / 2 - box.top - my;
          const dist = Math.hypot(dx, dy) || 1;
          const R = 150;
          if (dist >= R) {
            el.style.transform = '';
            return;
          }
          const k = 1 - dist / R;
          const ux = dx / dist;
          const uy = dy / dist;
          // radial push plus a turn of the tangent (-uy, ux): a little eddy
          const ox = (ux * 50 - uy * 70) * k;
          const oy = (uy * 50 + ux * 70) * k;
          el.style.transform = `translate(${ox}px, ${oy}px) rotate(${k * 180}deg)`;
        });
      } else if (scene === 'spring-night') {
        all('[data-attract]').forEach((el) => {
          const dx = mx - el.offsetLeft;
          const dy = my - el.offsetTop;
          const R = 340;
          const dist = Math.hypot(dx, dy);
          const k = dist < R ? 0.8 * (1 - dist / R) ** 0.5 : 0;
          el.style.transform = k ? `translate(${dx * k}px, ${dy * k}px)` : '';
        });
      } else if (scene === 'autumn-night') {
        // wind: the closer a cloud is to the cursor, the faster it drifts.
        // The speed eases toward its target, so gusts build up and die down,
        // and after the cursor leaves the clouds calm back to normal.
        all('[data-cloud]').forEach((el) => {
          const drift = el.getAnimations()[0]; // first in its animation list
          if (!drift) return;
          let target = 1;
          if (inside) {
            const r = el.getBoundingClientRect();
            // distance from the cursor to the nearest point of the cloud
            const cx = mx + box.left;
            const cy = my + box.top;
            const nx = Math.max(r.left, Math.min(cx, r.right));
            const ny = Math.max(r.top, Math.min(cy, r.bottom));
            const dist = Math.hypot(cx - nx, cy - ny);
            // capped low: much faster and the cloud is swept off the edge
            // in a couple of seconds, which reads as it vanishing
            const R = 200;
            if (dist < R) target = 1 + 2.5 * (1 - dist / R);
          }
          const rate = drift.playbackRate + (target - drift.playbackRate) * 0.03;
          drift.playbackRate = Math.abs(rate - target) < 0.01 ? target : rate;
          if (drift.playbackRate !== 1) settling = true;
        });
      }
      raf = inside || settling ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e: PointerEvent) => {
      const box = fx.getBoundingClientRect();
      mx = e.clientX - box.left;
      my = e.clientY - box.top;
      fx.style.setProperty('--mx', `${mx}px`);
      fx.style.setProperty('--my', `${my}px`);
      inside = true;
      fx.dataset.hover = '';
      if (!raf) raf = requestAnimationFrame(tick);
    };
    // the loop keeps running until the clouds have calmed down
    const onLeave = () => {
      inside = false;
      delete fx.dataset.hover;
      reset();
    };

    // summer night: a click calls up a shooting star that crosses the whole
    // footer through that point, on the same gentle slope as the others
    const onClick = (e: MouseEvent) => {
      if (sceneNow() !== 'summer-night') return;
      const sky = fx.querySelector(`.${styles.summer} .${styles.night}`);
      if (!sky) return;
      const box = fx.getBoundingClientRect();
      const x = e.clientX - box.left;
      const y = e.clientY - box.top;
      const slope = Math.tan((10 * Math.PI) / 180);
      const len = 140; // .meteor's width
      // the head starts just past the right edge, on the line through (x, y)
      const x0 = box.width + 20;
      const y0 = y - (x0 - x) * slope;
      const run = (x0 + len + 20) / Math.cos((10 * Math.PI) / 180);
      const star = document.createElement('span');
      star.className = styles.meteor;
      Object.assign(star.style, { left: `${x0 - len}px`, top: `${y0}px`, animation: 'none' });
      sky.append(star);
      star
        .animate(
          [
            { transform: 'translateX(0) scaleX(0.4)', opacity: 0 },
            { opacity: 1, offset: 0.08 },
            { transform: `translateX(${run * 0.2}px) scaleX(1)`, offset: 0.25 },
            { opacity: 1, offset: 0.85 },
            { transform: `translateX(${run}px) scaleX(1)`, opacity: 0 },
          ],
          { duration: 600 + box.width * 0.6, easing: 'linear' },
        )
        .finished.then(() => star.remove());
    };

    foot.addEventListener('pointermove', onMove);
    foot.addEventListener('pointerleave', onLeave);
    foot.addEventListener('click', onClick);
    return () => {
      foot.removeEventListener('pointermove', onMove);
      foot.removeEventListener('pointerleave', onLeave);
      foot.removeEventListener('click', onClick);
      cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}

export function FooterSeasonFx() {
  const ref = useCursorFx();
  return (
    <div ref={ref} className={styles.fx} aria-hidden="true">
      {FALLING.map(({ season, Shape, speed }) => (
        <div key={season} className={`${styles.layer} ${styles[season]}`}>
          {season === 'winter' && (
            // dark theme only: a dense starry sky and a mountain with a
            // few village lights, behind the falling snow
            <div className={styles.night}>
              <Stars list={WINTER_STARS} />
              <svg className={styles.mountain} viewBox="0 0 400 180" preserveAspectRatio="xMaxYMax meet">
                <path d={RIDGE} className={styles.ridge} />
                <path d={MOUNTAIN} />
                <g className={styles.village}>
                  {VILLAGE.map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r={1.3} />
                  ))}
                </g>
              </svg>
            </div>
          )}
          {season === 'spring' && (
            // light theme only: a flock of birds
            <div className={styles.day}>
              <FooterFlock />
            </div>
          )}
          {season === 'spring' && (
            // dark theme only: stars, and fireflies that gather round the cursor
            <div className={styles.night}>
              <Stars />
              {FIREFLIES.map(([left, top, delay, dur], i) => (
                <span key={i} className={styles.spot} data-attract style={{ left: `${left}%`, top: `${top}%` }}>
                  <span
                    className={styles.firefly}
                    style={{
                      animationDelay: `-${delay}s, -${delay * 0.7}s`,
                      animationDuration: `${dur}s, ${2 + (i % 3)}s`,
                    }}
                  />
                </span>
              ))}
            </div>
          )}
          {season === 'autumn' && (
            // dark theme only: stars and a small moon, hidden now and then
            // by dark clouds drifting past (behind the falling leaves)
            <div className={styles.night}>
              <Stars />
              <span className={styles.moon} />
              {CLOUDS.map(([top, width, delay, dur], i) => (
                <span
                  key={i}
                  data-cloud
                  className={styles.cloud}
                  style={{
                    top: `${top}%`,
                    width: `${width}cqw`,
                    // drift across, and billow (swell/shrink) on its own clock
                    animationDelay: `-${delay}s, -${delay / 3}s`,
                    animationDuration: `${dur}s, ${15 + i * 4}s`,
                  }}
                >
                  <svg viewBox="0 0 300 100" preserveAspectRatio="none">
                    <path d={CLOUD_SHAPES[i % CLOUD_SHAPES.length]} fill="currentColor" />
                  </svg>
                </span>
              ))}
            </div>
          )}
          {Shape && DROPS.map(([left, delay, dur, size, sway], i) => (
            <span
              key={i}
              className={styles.drop}
              style={{
                left: `${left}%`,
                animationDelay: `-${delay * speed}s`,
                animationDuration: `${dur * speed}s`,
                ['--size' as string]: `${size}px`,
                ['--sway' as string]: `${sway}px`,
              }}
            >
              <span className={styles.push} data-push>
                <span className={styles.spin} style={{ animationDuration: `${(dur * speed) / 2}s` }}>
                  <Shape />
                </span>
              </span>
            </span>
          ))}
        </div>
      ))}
      <div className={`${styles.layer} ${styles.summer}`}>
        {/* light theme: sun beams; dark theme: the Milky Way crossing the
            sky as clouds of faint points, and the odd shooting star (CSS
            picks one) */}
        <div className={styles.sun} />
        <span className={`${styles.glow} ${styles.sunGlow}`} />
        <div className={styles.night}>
          <Stars list={SUMMER_STARS} glint />
          <div className={styles.galaxy}>
            {/* % positions and px radii, so the dots stay round however
                the band's box is stretched. Split into three layers
                that shimmer on their own clocks */}
            {[0, 1, 2].map((g) => (
              <svg key={g} className={styles.dust}>
                {MILKY_WAY.filter((_, i) => i % 3 === g).map(([u, v, r, o, fill], i) => (
                  <circle key={i} data-glint cx={`${u}%`} cy={`${v}%`} r={r} fill={fill} fillOpacity={o} />
                ))}
              </svg>
            ))}
            <Stars list={MILKY_WAY_BRIGHT} glint />
          </div>
          {METEORS.map(([top, delay, dur], i) => (
            <span
              key={i}
              className={styles.meteor}
              style={{ top: `${top}%`, animationDelay: `${delay}s`, animationDuration: `${dur}s` }}
            />
          ))}
          {/* glints laid over the stars the cursor passes (useCursorFx) */}
          {Array.from({ length: 24 }, (_, i) => (
            <span key={i} className={styles.glint} data-glint-dot />
          ))}
        </div>
      </div>
    </div>
  );
}
