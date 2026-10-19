// Brand mark: two interlocking ovals (blue + teal), as in the Instagram highlights.
//
// The weave is built from plain arcs, no clipping: oval A is cut into arcs that
// each contain one crossing, alternately drawn under and over oval B. Every
// crossing therefore alternates over/under, like a real chain link.

interface Oval {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rot: number; // degrees
  color: string;
}

const BLUE = 'var(--blue)';
const TEAL = 'var(--teal-deep)';
const TAU = Math.PI * 2;

export const OVAL_VARIANTS = {
  // round ring hooked through a tilted oval
  design: [
    { cx: 42, cy: 60, rx: 24, ry: 24, rot: 0, color: BLUE },
    { cx: 60, cy: 38, rx: 30, ry: 12, rot: -55, color: TEAL },
  ],
  // long flat oval with a small ring hooked on its top edge
  sketch: [
    { cx: 50, cy: 58, rx: 42, ry: 18, rot: -12, color: BLUE },
    { cx: 64, cy: 38, rx: 14, ry: 20, rot: 25, color: TEAL },
  ],
  // tall oval hooked through a long diagonal one
  character: [
    { cx: 36, cy: 50, rx: 15, ry: 40, rot: 14, color: TEAL },
    { cx: 61, cy: 46, rx: 32, ry: 12, rot: -30, color: BLUE },
  ],
  // two ovals crossed in an X
  ink: [
    { cx: 50, cy: 50, rx: 42, ry: 16, rot: 45, color: BLUE },
    { cx: 50, cy: 50, rx: 42, ry: 16, rot: -45, color: BLUE },
  ],
} satisfies Record<string, Oval[]>;

export type OvalVariant = keyof typeof OVAL_VARIANTS;


const rad = (deg: number) => (deg * Math.PI) / 180;

const point = (o: Oval, t: number) => {
  const r = rad(o.rot);
  const x = o.rx * Math.cos(t);
  const y = o.ry * Math.sin(t);
  return { x: o.cx + x * Math.cos(r) - y * Math.sin(r), y: o.cy + x * Math.sin(r) + y * Math.cos(r) };
};

// > 0 outside `o`, < 0 inside
const side = (o: Oval, p: { x: number; y: number }) => {
  const r = rad(-o.rot);
  const dx = p.x - o.cx;
  const dy = p.y - o.cy;
  const x = dx * Math.cos(r) - dy * Math.sin(r);
  const y = dx * Math.sin(r) + dy * Math.cos(r);
  return (x / o.rx) ** 2 + (y / o.ry) ** 2 - 1;
};

// Parameters t on `a` where it crosses `b`, refined by bisection.
function crossings(a: Oval, b: Oval) {
  const ts: number[] = [];
  const steps = 720;
  const f = (t: number) => side(b, point(a, t));
  for (let i = 0; i < steps; i++) {
    let lo = (i / steps) * TAU;
    let hi = ((i + 1) / steps) * TAU;
    if (f(lo) > 0 === f(hi) > 0) continue;
    for (let k = 0; k < 30; k++) {
      const mid = (lo + hi) / 2;
      if (f(lo) > 0 === f(mid) > 0) lo = mid;
      else hi = mid;
    }
    ts.push((lo + hi) / 2);
  }
  return ts;
}

const fmt = (n: number) => +n.toFixed(3);

// SVG path for the arc of `o` from t0 to t1 (t1 > t0), in increasing t.
function arc(o: Oval, t0: number, t1: number) {
  const p0 = point(o, t0);
  const p1 = point(o, t1);
  const large = t1 - t0 > Math.PI ? 1 : 0;
  return `M${fmt(p0.x)} ${fmt(p0.y)}A${o.rx} ${o.ry} ${o.rot} ${large} 1 ${fmt(p1.x)} ${fmt(p1.y)}`;
}

// Oval A cut into arcs that each hold one crossing, alternately under and over B.
function weave(a: Oval, b: Oval) {
  const ts = crossings(a, b);
  const under: string[] = [];
  const over: string[] = [];
  if (ts.length < 2 || ts.length % 2) return { under, over };

  // cut points halfway between consecutive crossings
  const cuts = ts.map((t, i) => {
    const next = i + 1 < ts.length ? ts[i + 1] : ts[0] + TAU;
    return (t + next) / 2;
  });
  cuts.forEach((c, i) => {
    const next = i + 1 < cuts.length ? cuts[i + 1] : cuts[0] + TAU;
    (i % 2 ? over : under).push(arc(a, c, next));
  });
  return { under, over };
}

interface OvalMarkProps {
  variant?: OvalVariant;
  className?: string;
  style?: React.CSSProperties;
}

const STROKE = { fill: 'none', strokeWidth: 7, strokeLinecap: 'round' as const };

const ellipseProps = (o: Oval) => ({
  cx: o.cx,
  cy: o.cy,
  rx: o.rx,
  ry: o.ry,
  transform: `rotate(${o.rot} ${o.cx} ${o.cy})`,
});

export function OvalMark({ variant = 'design', className, style }: OvalMarkProps) {
  const [a, b] = OVAL_VARIANTS[variant];
  const { under, over } = weave(a, b);
  const woven = under.length > 0;

  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true" focusable="false">
      {woven ? (
        under.map((d) => <path key={d} d={d} stroke={a.color} {...STROKE} />)
      ) : (
        <ellipse {...ellipseProps(a)} stroke={a.color} {...STROKE} />
      )}
      <ellipse {...ellipseProps(b)} stroke={b.color} {...STROKE} />
      {over.map((d) => <path key={d} d={d} stroke={a.color} {...STROKE} />)}
    </svg>
  );
}

// A single teal ring crossing a word, like a planet's ring: the far half sits
// behind the letters and the near half in front, so it looks threaded through.
// Each half is also split into short arcs; `--i` (0…1, position round the ring)
// lets CSS offset a colour animation per arc, so a smooth teal → blue gradient
// travels round the orbit.
const RING: Oval = { cx: 100, cy: 50, rx: 94, ry: 22, rot: 0, color: TEAL }; // flat; the tilt is set in CSS
const SEGMENTS = 48; // per half
const OVERLAP = 0.006; // radians; hides hairline seams between arcs

interface OvalRingProps {
  /** class for the half behind the letters */
  backClassName?: string;
  /** class for the half in front of the letters */
  frontClassName?: string;
  /** class for the gradient arcs that travel round the ring */
  flowClassName?: string;
}

export function OvalRing({ backClassName, frontClassName, flowClassName }: OvalRingProps) {
  const stroke = { fill: 'none', strokeWidth: 3.6 };
  const half = (t0: number, className?: string) => (
    <svg viewBox="0 0 200 100" className={className} aria-hidden="true" focusable="false">
      <path d={arc(RING, t0, t0 + Math.PI)} stroke={TEAL} strokeLinecap="round" {...stroke} />
      <g className={flowClassName}>
        {Array.from({ length: SEGMENTS }, (_, i) => {
          const a = t0 + (i / SEGMENTS) * Math.PI;
          const b = t0 + ((i + 1) / SEGMENTS) * Math.PI;
          return (
            <path
              key={i}
              d={arc(RING, a - OVERLAP, b + OVERLAP)}
              stroke={TEAL}
              style={{ '--i': fmt((a + b) / 2 / TAU) } as React.CSSProperties}
              {...stroke}
            />
          );
        })}
      </g>
    </svg>
  );
  return (
    <>
      {half(Math.PI, backClassName)}
      {half(0, frontClassName)}
    </>
  );
}
