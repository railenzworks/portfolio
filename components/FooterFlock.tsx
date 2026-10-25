'use client';

import { useEffect, useRef } from 'react';

// Spring day: a small flock of 3D birds on a canvas filling the footer, after
// the classic three.js "birds" demo. Each bird is three triangles (two wings
// and a little body fin) turned to face where it's flying, with wing tips that
// beat faster the faster it goes. They flock in 3D (boids: drift toward the
// neighbours' centre, match their heading, keep apart from the closest) and
// are drawn with a weak perspective: each bird shrinks as it flies away, but
// its shape isn't skewed by where it is in the wide view (a true perspective
// stretches the birds out of shape near the footer's sides). The flock is drawn to a slowly
// wandering point, or to the cursor while it's over the footer. Above them two
// birds of prey slowly circle, paying the cursor no mind.

const COUNT = 40;
const SCALE = 3; // bird size, in world units per model unit (wingspan 6)
const MAX_SPEED = 11;
// never slower than this: without it they stall wherever the pulls balance
// out (round the target, against a wall) and hang there
const MIN_SPEED = 6;
const COHESION = 0.6; // pull toward the neighbours' centre
// pull toward the wandering point / the cursor, and how close they may get
// (world units) before pushing apart; while chasing the cursor they're drawn
// in hard and fly tighter, so the swarm round it reads clearly
const TARGET = { free: 1, chase: 3.4 };
const SEPARATE = { free: 45, chase: 26 };

// birds of prey circling high up, on their own (it ignores the cursor): flat
// silhouette seen from below, heading along +x, wingspan 12 units
const HAWK =
  'M2.2 0Q2 -0.45 1.2 -0.5L0.8 -0.6Q0.9 -3.5 0.1 -6Q-0.5 -6.1 -0.8 -5.6Q-0.9 -3 -1.1 -0.6' + // head, upper wing
  'L-0.9 -0.45L-3 -1.2L-3 1.2L-0.9 0.45' + // tail: a straight-edged wedge, close behind the wings
  'L-1.1 0.6Q-0.9 3 -0.8 5.6Q-0.5 6.1 0.1 6Q0.9 3.5 0.8 0.6L1.2 0.5Q2 0.45 2.2 0Z'; // lower wing
const HAWK_SIZE = 1.4; // px per unit: about 17px wingspan
// faint: they're far off, high above the flock
const HAWK_COLOR = 'rgba(40, 45, 56, 0.45)';
// each: circle centre (fraction of width / height), radius (fraction of width,
// capped in px), angular speed (rad/s; negative circles the other way), phase
const HAWKS = [
  { x: 0.72, y: 0.3, r: 0.12, max: 140, speed: 0.32, phase: 0 },
  { x: 0.36, y: 0.22, r: 0.09, max: 110, speed: -0.26, phase: 2 },
];
const COLOR = 'rgb(52, 58, 70)';

// camera at z = CAM looking down -z, 60deg vertical field of view
const CAM = 350;
const TAN_HALF_FOV = Math.tan(Math.PI / 6);
const DEPTH = 150; // birds stay within z = +-DEPTH

// the bird model, three triangles: left wing, body fin, right wing. Nose
// along +z; vertices 1 and 7 are the wing tips, whose y is flapped.
const MODEL = [
  [0, 0, -1.5], [-3, 0, 0], [0, 0, 1.5],
  [0, 0, -1.5], [0, 0, 1.5], [0, 0.6, 0],
  [0, 0, -1.5], [3, 0, 0], [0, 0, 1.5],
];

// they only fly in spring, light theme
const isSpringDay = () => {
  const root = document.documentElement;
  return root.dataset.season === 'spring' && root.dataset.theme !== 'dark';
};

export function FooterFlock() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const foot = canvas?.closest('footer');
    const ctx = canvas?.getContext('2d');
    if (!canvas || !foot || !ctx) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const hawk = new Path2D(HAWK); // Path2D only exists in the browser

    let w = 0;
    let h = 0;
    let dpr = 1;
    let focal = 1; // px per world unit at distance 1
    let halfW = 1; // half the visible world width / height at z = 0
    let halfH = 1;
    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      focal = h / 2 / TAN_HALF_FOV;
      halfH = CAM * TAN_HALF_FOV;
      halfW = halfH * (w / (h || 1));
    };
    resize();

    const pos = Array.from({ length: COUNT }, () => [0, 0, 0]);
    const vel = Array.from({ length: COUNT }, () => [0, 0, 0]);
    const phase = Array.from({ length: COUNT }, () => Math.random() * Math.PI * 2);
    // scattered through the sky on the first frame they're shown, since the
    // canvas has no size while another season is active
    let placed = false;
    const place = () => {
      for (let i = 0; i < COUNT; i++) {
        pos[i] = [(Math.random() - 0.5) * halfW * 1.6, (Math.random() - 0.5) * halfH * 1.4, (Math.random() - 0.5) * DEPTH];
        vel[i] = [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2];
      }
      placed = true;
    };

    // cursor, as a point in the world on the z = 0 plane
    let gx = 0;
    let gy = 0;
    let hovering = false;
    let chase = 0; // eases 0 -> 1 while hovering
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      gx = ((e.clientX - r.left - w / 2) / focal) * CAM;
      gy = (-(e.clientY - r.top - h / 2) / focal) * CAM;
      hovering = true;
    };
    const onLeave = () => (hovering = false);
    foot.addEventListener('pointermove', onMove);
    foot.addEventListener('pointerleave', onLeave);

    const acc = [0, 0, 0];
    const norm = (v: number[], len: number) => {
      const l = Math.hypot(v[0], v[1], v[2]);
      if (l > 0) {
        v[0] = (v[0] / l) * len;
        v[1] = (v[1] / l) * len;
        v[2] = (v[2] / l) * len;
      }
    };

    let t = 0;
    let last = 0;
    let raf = 0;

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min((now - (last || now)) / 1000, 0.1);
      last = now;
      if (!isSpringDay()) return;
      if (canvas.clientWidth !== w || canvas.clientHeight !== h) resize();
      if (!placed && w > 0) place();
      t += dt;

      // what the flock is drawn to: the cursor, or a point wandering the sky
      chase += ((hovering ? 1 : 0) - chase) * Math.min(1, dt * 3);
      const target = TARGET.free + (TARGET.chase - TARGET.free) * chase;
      const separate = SEPARATE.free + (SEPARATE.chase - SEPARATE.free) * chase;
      const tx = hovering ? gx : Math.sin(t * 0.23) * halfW * 0.6;
      const ty = hovering ? gy : Math.sin(t * 0.37 + 1) * halfH * 0.4;

      for (let i = 0; i < COUNT; i++) {
        const p = pos[i];
        const v = vel[i];
        const coh = [0, 0, 0];
        const ali = [0, 0, 0];
        const sep = [0, 0, 0];
        let n = 0;
        for (let j = 0; j < COUNT; j++) {
          if (j === i) continue;
          const q = pos[j];
          const dx = p[0] - q[0];
          const dy = p[1] - q[1];
          const dz = p[2] - q[2];
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 >= 6400) continue; // neighbours: within 80
          coh[0] += q[0];
          coh[1] += q[1];
          coh[2] += q[2];
          ali[0] += vel[j][0];
          ali[1] += vel[j][1];
          ali[2] += vel[j][2];
          n++;
          if (d2 < separate * separate && d2 > 0) {
            // too close: push away, harder the closer
            const d = Math.sqrt(d2);
            sep[0] += dx / d / d;
            sep[1] += dy / d / d;
            sep[2] += dz / d / d;
          }
        }
        acc[0] = acc[1] = acc[2] = 0;
        if (n) {
          coh[0] = coh[0] / n - p[0];
          coh[1] = coh[1] / n - p[1];
          coh[2] = coh[2] / n - p[2];
          norm(coh, COHESION);
          norm(ali, 0.5);
          norm(sep, 3);
          for (let k = 0; k < 3; k++) acc[k] += coh[k] + ali[k] + sep[k];
        }
        const pull = [tx - p[0], ty - p[1], -p[2]];
        norm(pull, target);
        for (let k = 0; k < 3; k++) acc[k] += pull[k];
        // soft walls: turn back near the edges of the view
        if (Math.abs(p[0]) > halfW * 0.92) acc[0] -= Math.sign(p[0]) * 2;
        if (Math.abs(p[1]) > halfH * 0.85) acc[1] -= Math.sign(p[1]) * 2;
        if (Math.abs(p[2]) > DEPTH) acc[2] -= Math.sign(p[2]) * 2;

        for (let k = 0; k < 3; k++) v[k] += acc[k] * dt * 7;
        const speed = Math.hypot(v[0], v[1], v[2]);
        if (speed > MAX_SPEED) norm(v, MAX_SPEED);
        else if (speed < MIN_SPEED) {
          if (speed < 1e-3) v[0] = 1; // no heading at all: pick one
          norm(v, MIN_SPEED);
        }
        for (let k = 0; k < 3; k++) p[k] += v[k] * dt * 40;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // the hawks: wide, slow circles seen at a slant (so ellipses); they
      // rock a little as they bank round
      ctx.fillStyle = HAWK_COLOR;
      for (const k of HAWKS) {
        const a = k.phase + t * k.speed;
        const rad = Math.min(w * k.r, k.max);
        const hx = w * k.x + Math.cos(a) * rad;
        const hy = h * k.y + Math.sin(a) * rad * 0.45;
        const head = Math.atan2(Math.cos(a) * 0.45 * k.speed, -Math.sin(a) * k.speed);
        const bank = 0.88 + 0.12 * Math.cos(a);
        const hc = Math.cos(head) * HAWK_SIZE;
        const hs = Math.sin(head) * HAWK_SIZE;
        ctx.setTransform(hc * dpr, hs * dpr, -hs * bank * dpr, hc * bank * dpr, hx * dpr, hy * dpr);
        ctx.fill(hawk);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.fillStyle = COLOR;
      // far birds first, so near ones are drawn over them
      const order = pos.map((_, i) => i).sort((a, b) => pos[a][2] - pos[b][2]);
      for (const i of order) {
        const p = pos[i];
        const v = vel[i];
        // the bird's axes, as three.js lookAt builds them: forward along its
        // velocity, right = up x forward, its own up = forward x right
        const f = [v[0], v[1], v[2]];
        norm(f, 1);
        const r = [f[2], 0, -f[0]]; // (0,1,0) x f
        if (Math.hypot(r[0], r[2]) < 1e-4) r[0] = 1;
        norm(r, 1);
        const u = [f[1] * r[2] - f[2] * r[1], f[2] * r[0] - f[0] * r[2], f[0] * r[1] - f[1] * r[0]];
        // wing tips beat faster the faster it flies
        const flap = Math.sin(t * Math.hypot(v[0], v[1], v[2]) * 4 + phase[i]) * 1.5;

        // one scale for the whole bird, from the depth of its centre
        const s = focal / (CAM - p[2]);
        const ox = w / 2 + p[0] * s;
        const oy = h / 2 - p[1] * s;

        ctx.beginPath();
        for (let k = 0; k < 9; k++) {
          const [mx, my0, mz] = MODEL[k];
          const my = k === 1 || k === 7 ? flap : my0;
          const sx = ox + (r[0] * mx + u[0] * my + f[0] * mz) * SCALE * s;
          const sy = oy - (r[1] * mx + u[1] * my + f[1] * mz) * SCALE * s;
          if (k % 3 === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      foot.removeEventListener('pointermove', onMove);
      foot.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
}
