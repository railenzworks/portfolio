'use client';

import { useEffect, useRef } from 'react';
import { FooterFlock } from './FooterFlock';
import styles from './FooterSeasonFx.module.css';

// Decorative layer behind the footer's text: falling leaves (autumn), snow
// (winter), petals (spring) or sun rays (summer). All four are rendered and
// CSS shows the one matching <html data-season>, so switching the season in
// SeasonPicker swaps the effect. "main" shows none.
//
// With the cursor over the footer (see useCursorFx):
//   summer day   - a patch of warm sunlight follows it
//   summer night - fireflies gather round it
//   autumn day   - leaves are blown away from it
//   autumn night - it blows like wind: clouds near it speed up
//   winter       - snow swirls round it in a little eddy
//   spring day   - the flock wheels round it (FooterFlock)

// fixed pseudo-random layout so server and client markup match:
// [left %, delay s, duration s, size px, sway px]
const DROPS: [number, number, number, number, number][] = [
  [4, 0, 11, 18, 40], [12, 4.5, 14, 13, -30], [21, 1.8, 10, 22, 50],
  [30, 7, 13, 15, -45], [38, 2.6, 12, 19, 35], [47, 9, 15, 12, -25],
  [55, 0.9, 11, 21, 55], [63, 5.5, 13, 14, -40], [71, 3.2, 10, 17, 30],
  [79, 8.2, 14, 20, -50], [87, 1.2, 12, 13, 45], [95, 6.3, 11, 16, -35],
];

// summer night, stars: [left %, top %, size px, twinkle delay s]
const STARS: [number, number, number, number][] = [
  [3, 12, 2, 0], [9, 38, 1.5, 1.2], [15, 8, 2.5, 2.4], [22, 27, 1.5, 0.6],
  [28, 55, 2, 3.1], [34, 15, 1.5, 1.8], [41, 42, 2.5, 0.3], [47, 6, 1.5, 2.7],
  [53, 30, 2, 1.1], [59, 60, 1.5, 3.4], [64, 18, 2.5, 0.9], [70, 45, 1.5, 2.1],
  [76, 10, 2, 1.5], [82, 34, 1.5, 3.8], [88, 20, 2.5, 0.4], [94, 50, 1.5, 2.9],
  [6, 70, 1.5, 1.7], [37, 75, 1.5, 0.2], [67, 80, 1.5, 2.2], [97, 8, 2, 3.3],
];

// summer night, fireflies: [left %, top %, delay s, drift duration s]
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

function Flower() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <g fill="currentColor">
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse key={r} cx="12" cy="6.5" rx="3.6" ry="5" transform={`rotate(${r} 12 12)`} />
        ))}
      </g>
      <circle cx="12" cy="12" r="2.6" fill="#ffdf3d" />
    </svg>
  );
}

// speed: multiplier on each drop's duration (lower = faster)
const FALLING = [
  { season: 'autumn', Shape: Leaf, speed: 0.7 },
  { season: 'winter', Shape: Flake, speed: 1 },
  { season: 'spring', Shape: Flower, speed: 1 },
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

function Stars({ list = STARS }: { list?: [number, number, number, number][] }) {
  return list.map(([left, top, size, delay], i) => (
    <span
      key={i}
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

    const reset = () => {
      all('[data-push], [data-attract]').forEach((el) => (el.style.transform = ''));
    };

    const tick = () => {
      const box = fx.getBoundingClientRect();
      const scene = sceneNow();
      let settling = false;

      if (scene === 'autumn-day') {
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
      } else if (scene === 'summer-night') {
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

    foot.addEventListener('pointermove', onMove);
    foot.addEventListener('pointerleave', onLeave);
    return () => {
      foot.removeEventListener('pointermove', onMove);
      foot.removeEventListener('pointerleave', onLeave);
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
            // light theme only: a flock of birds (in place of the falling
            // flowers, which only show at night)
            <div className={styles.day}>
              <FooterFlock />
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
          {DROPS.map(([left, delay, dur, size, sway], i) => (
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
        {/* light theme: sun beams; dark theme: night sky (CSS picks one) */}
        <div className={styles.sun} />
        <span className={`${styles.glow} ${styles.sunGlow}`} />
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
      </div>
    </div>
  );
}
