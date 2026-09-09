'use client';

import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';

/**
 * Neko — anime cat blob.
 *
 * A solid silhouette: eyes, whiskers and mouth are cut out of the body with
 * an SVG mask, so the page background shows through them. Speaks in a soft
 * bubble and can leave the stage by jumping into a hole. Animation runs in a
 * single requestAnimationFrame; styles are written straight to refs, so
 * React never re-renders per frame.
 *
 * Ported from a Framer component (Neko mascot). The "watch password inputs"
 * behavior (shutting its eyes when a password field is focused) was removed.
 */

export type NekoEmotion = 'idle' | 'happy' | 'sad' | 'error';

export interface NekoCatProps {
  furColor?: string;
  /** Fills the eye holes with a solid color instead of letting the page background show through. */
  eyeColor?: string;
  /** Adds a couple of colored patches on the head and one on the tail. */
  patchColor?: string;
  emotion?: NekoEmotion;
  followCursor?: boolean;
  blink?: boolean;
  coverEyes?: boolean;
  entranceOnScroll?: boolean;
  tiltOnScroll?: boolean;
  squintOnClick?: boolean;
  eventName?: string;
  showShadow?: boolean;
  speed?: number;
  showBubble?: boolean;
  message?: string;
  font?: CSSProperties;
  textColor?: string;
  bubbleColor?: string;
  bubbleRadius?: number;
  bubbleShadow?: boolean;
  bubbleWidth?: number;
  bubbleGap?: number;
  hideCat?: boolean;
  style?: CSSProperties;
}

interface NekoExternalDetail {
  reset?: boolean;
  emotion?: string;
  message?: string | null;
  hideCat?: boolean;
  showBubble?: boolean;
  squint?: boolean;
}

interface ExternalOverride {
  emotion?: string;
  message?: string;
  hideCat?: boolean;
  showBubble?: boolean;
}

export function NekoCat(props: NekoCatProps) {
  const {
    furColor = '#17150f',
    eyeColor,
    patchColor,
    emotion = 'idle',
    followCursor = true,
    blink = true,
    coverEyes = false,
    entranceOnScroll = true,
    tiltOnScroll = true,
    squintOnClick = true,
    eventName = 'neko',
    showShadow = true,
    speed = 1,
    showBubble = true,
    message = 'Hi! I can talk.',
    font,
    textColor = '#17150f',
    bubbleColor = '#FFFFFF',
    bubbleRadius = 26,
    bubbleShadow = true,
    bubbleWidth = 230,
    bubbleGap = 2,
    hideCat = false,
    style,
  } = props;

  // external control: window.dispatchEvent(new CustomEvent(eventName, { detail: {...} }))
  const [ext, setExt] = useState<ExternalOverride>({});

  useEffect(() => {
    if (!eventName) return;
    const onExternal = (e: Event) => {
      const d = (e as CustomEvent<NekoExternalDetail>).detail || {};
      if (d.reset) {
        setExt({});
        return;
      }
      const next: ExternalOverride = {};
      if (typeof d.emotion === 'string') next.emotion = d.emotion;
      if (typeof d.message === 'string') next.message = d.message;
      if (typeof d.hideCat === 'boolean') next.hideCat = d.hideCat;
      if (typeof d.showBubble === 'boolean') next.showBubble = d.showBubble;
      if (Object.keys(next).length) setExt((prev) => ({ ...prev, ...next }));
      if (d.squint) pokeRef.current = 1;
    };
    window.addEventListener(eventName, onExternal);
    return () => window.removeEventListener(eventName, onExternal);
  }, [eventName]);

  const emotionNow = ext.emotion ?? emotion;
  const messageNow = ext.message ?? message;
  const hideCatNow = ext.hideCat ?? hideCat;
  const showBubbleNow = ext.showBubble ?? showBubble;

  const isHappyInit = emotionNow === 'happy';
  const isSadInit = emotionNow === 'sad';
  const isErrorInit = emotionNow === 'error';

  // initial pose so there's no flash of the wrong face before the first
  // animation frame runs
  const pose = {
    open: isHappyInit || isErrorInit ? 0 : 1,
    happy: isHappyInit ? 1 : 0,
    sad: isSadInit ? 1 : 0,
    error: isErrorInit ? 1 : 0,
    mHappy: isHappyInit ? 1 : 0,
    mSad: isSadInit ? 1 : 0,
    mError: isErrorInit ? 1 : 0,
    shadow: showShadow ? 0.14 : 0,
  };

  const uid = useId().replace(/:/g, '');
  const maskId = `neko-mask-${uid}`;
  const clipId = `neko-clip-${uid}`;
  const furClipId = `neko-furclip-${uid}`;
  const tailClipId = `neko-tailclip-${uid}`;

  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<SVGGElement>(null);
  const tailRef = useRef<SVGGElement>(null);
  const shadowRef = useRef<SVGEllipseElement>(null);
  const holeRef = useRef<SVGEllipseElement>(null);
  const lipRef = useRef<SVGPathElement>(null);
  const eyesWrapRef = useRef<SVGGElement>(null);
  const eyeLRef = useRef<SVGGElement>(null);
  const eyeRRef = useRef<SVGGElement>(null);
  const eyesOpenRef = useRef<SVGGElement>(null);
  const irisGroupRef = useRef<SVGGElement>(null);
  const irisLRef = useRef<SVGGElement>(null);
  const irisRRef = useRef<SVGGElement>(null);
  const eyesHappyRef = useRef<SVGGElement>(null);
  const eyesSadRef = useRef<SVGGElement>(null);
  const eyesErrorRef = useRef<SVGGElement>(null);
  const mouthHappyRef = useRef<SVGGElement>(null);
  const mouthSadRef = useRef<SVGGElement>(null);
  const mouthErrorRef = useRef<SVGGElement>(null);

  const bubbleOnNow = showBubbleNow && !hideCatNow && String(messageNow).trim().length > 0;

  const live = useRef({
    emotion: emotionNow,
    followCursor,
    coverEyes,
    blink,
    tiltOnScroll,
    speed,
    hideCat: hideCatNow,
    squintOnClick,
    showShadow,
    bubbleOn: bubbleOnNow,
  });
  live.current = {
    emotion: emotionNow,
    followCursor,
    coverEyes,
    blink,
    tiltOnScroll,
    speed,
    hideCat: hideCatNow,
    squintOnClick,
    showShadow,
    bubbleOn: bubbleOnNow,
  };

  const pokeRef = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)') ?? null;
    let reduced = !!mq?.matches;
    const onMotionPref = (e: MediaQueryListEvent) => {
      reduced = e.matches;
    };
    mq?.addEventListener?.('change', onMotionPref);

    const s = {
      t: 0,
      pupilX: 0,
      pupilY: 0,
      targetPupilX: 0,
      targetPupilY: 0,
      lid: 1,
      blinkAt: 1.2,
      blinkPhase: -1,
      cover: 0,
      tilt: 0,
      tiltTarget: 0,
      appear: entranceOnScroll ? 0 : 1,
      appearTarget: entranceOnScroll ? 0 : 1,
      shake: 0,
      poke: 0,
      unit: 1,
      onScreen: true,
      bubY: 0,
      bubR: 0,
      bubV: 0,
      hideP: hideCatNow ? 1 : 0,
      lastEmotion: emotionNow,
      o: { open: 1, happy: 0, sad: 0, error: 0, mHappy: 0, mSad: 0, mError: 0 },
    };

    const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
    const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
    const smooth = (v: number, a: number, b: number) => {
      const u = clamp((v - a) / (b - a), 0, 1);
      return u * u * (3 - 2 * u);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!live.current.followCursor) return;
      const r = root.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / Math.max(r.width, 1);
      const dy = (e.clientY - (r.top + r.height * 0.78)) / Math.max(r.height, 1);
      s.targetPupilX = clamp(dx * 12, -4, 4);
      s.targetPupilY = clamp(dy * 10, -3, 3.5);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let lastScroll = window.scrollY;
    const onScroll = () => {
      if (!live.current.tiltOnScroll) return;
      const d = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      s.tiltTarget = clamp(s.tiltTarget - d * 0.3, -9, 9);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let ro: ResizeObserver | null = null;
    const measure = () => {
      const w = svgRef.current?.getBoundingClientRect().width;
      if (w) s.unit = w / 268;
    };
    measure();
    if ('ResizeObserver' in window && svgRef.current) {
      ro = new ResizeObserver(measure);
      ro.observe(svgRef.current);
    }

    let io: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          for (const en of entries) {
            s.onScreen = en.isIntersecting;
            if (entranceOnScroll) s.appearTarget = en.isIntersecting ? 1 : 0;
          }
        },
        { threshold: [0, 0.25] }
      );
      io.observe(root);
    }

    const setOpacity = (ref: React.RefObject<SVGGElement | null>, v: number) => {
      if (ref.current) ref.current.style.opacity = String(v);
    };

    let raf = 0;
    let prev = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      // nothing to compute off screen — skip the frame
      if (!s.onScreen && s.appear < 0.02) return;

      const p = live.current;
      s.t += reduced ? 0 : dt * p.speed;

      if (p.emotion !== s.lastEmotion) {
        if (p.emotion === 'error') s.shake = 1;
        s.lastEmotion = p.emotion;
      }

      const isH = p.emotion === 'happy';
      const isS = p.emotion === 'sad';
      const isE = p.emotion === 'error';
      const k = reduced ? 1 : 1 - Math.pow(0.001, dt);
      const t = {
        open: isH || isE ? 0 : 1,
        happy: isH ? 1 : 0,
        sad: isS ? 1 : 0,
        error: isE ? 1 : 0,
        mHappy: isH ? 1 : 0,
        mSad: isS ? 1 : 0,
        mError: isE ? 1 : 0,
      };
      (Object.keys(t) as (keyof typeof t)[]).forEach((key) => {
        s.o[key] = lerp(s.o[key], t[key], k);
      });
      setOpacity(eyesOpenRef, s.o.open);
      setOpacity(eyesHappyRef, s.o.happy);
      setOpacity(eyesSadRef, s.o.sad);
      setOpacity(eyesErrorRef, s.o.error);
      setOpacity(mouthHappyRef, s.o.mHappy);
      setOpacity(mouthSadRef, s.o.mSad);
      setOpacity(mouthErrorRef, s.o.mError);

      s.appear = lerp(s.appear, s.appearTarget, 1 - Math.pow(0.004, dt));
      root.style.opacity = String(0.1 + s.appear * 0.9);
      if (s.shake > 0) s.shake = Math.max(0, s.shake - dt * 1.8);
      const shakeX = reduced ? 0 : Math.sin(s.t * 46) * 4 * s.shake * s.shake;
      root.style.transform = `translate(${shakeX}px, ${(1 - s.appear) * 20}px) scale(${0.86 + s.appear * 0.14})`;

      // — jump into the hole —
      const dur = reduced ? 0.001 : 1.15;
      s.hideP = clamp(s.hideP + (p.hideCat ? dt / dur : -dt / dur), 0, 1);
      const P = s.hideP;
      let jumpY = 0;
      let jSx = 1;
      let jSy = 1;
      let jScale = 1;
      let catOpacity = 1;
      if (P > 0) {
        if (P < 0.14) {
          // crouch before the jump
          const u = P / 0.14;
          jumpY = 7 * u;
          jSy = 1 - 0.17 * u;
          jSx = 1 + 0.13 * u;
        } else if (P < 0.52) {
          // hop
          const u = (P - 0.14) / 0.38;
          const arc = Math.sin(Math.PI * u);
          jumpY = 7 - 7 * u - 84 * arc;
          jSy = 1 - 0.17 + 0.17 * u + 0.12 * arc;
          jSx = 1 + 0.13 - 0.13 * u - 0.09 * arc;
        } else {
          // shrinks before reaching the rim, otherwise it wouldn't fit in
          const u = (P - 0.52) / 0.48;
          jScale = 1 - 0.75 * Math.pow(u, 0.6);
          jumpY = 80 * Math.pow(u, 2.4);
          jSy = 1 - 0.08 * u;
          jSx = 1 + 0.08 * u;
          catOpacity = u < 0.9 ? 1 : 1 - (u - 0.9) / 0.1;
        }
      }
      const holeK = smooth(P, 0.16, 0.5) * (1 - smooth(P, 0.84, 1));

      // tap on the cat: a short, cute squint with a small crouch
      if (pokeRef.current > 0) {
        s.poke = 1;
        pokeRef.current = 0;
      }
      if (s.poke > 0) s.poke = Math.max(0, s.poke - dt / 0.85);
      const pokeU = 1 - s.poke;
      const squintK = s.poke > 0 ? Math.pow(Math.sin(Math.PI * Math.min(1, pokeU / 0.95)), 0.6) : 0;

      const wantCover = p.coverEyes;
      s.cover = lerp(s.cover, wantCover ? 1 : 0, 1 - Math.pow(4e-4, dt));
      const ease = s.cover * s.cover * (3 - 2 * s.cover);

      const breath = reduced ? 0 : Math.sin(s.t * 1.7) * 0.018;
      const bob = reduced ? 0 : Math.sin(s.t * 1.7) * 1.4 + (isH ? Math.abs(Math.sin(s.t * 4)) * -6 : 0);

      s.tiltTarget = lerp(s.tiltTarget, 0, 1 - Math.pow(0.02, dt));
      s.tilt = lerp(s.tilt, s.tiltTarget + (isS ? 4 : 0), 1 - Math.pow(0.01, dt));

      if (bodyRef.current) {
        bodyRef.current.style.opacity = String(catOpacity);
        bodyRef.current.style.transform = `translate(0px, ${bob + (isS ? 3 : 0) + ease * 9 + squintK * 4 + jumpY}px) rotate(${s.tilt}deg) scale(${(1 + breath * 0.5 + ease * 0.05 + squintK * 0.05) * jSx * jScale}, ${(1 + breath - ease * 0.06 - squintK * 0.05) * jSy * jScale})`;
      }
      if (shadowRef.current) {
        // the shadow belongs to the cat: it fades out as the hole opens and
        // stays gone once the cat is inside, otherwise it would outlive both
        const shadowVis = Math.min(1 - holeK, 1 - smooth(P, 0.5, 0.95));
        shadowRef.current.style.opacity = String(p.showShadow ? 0.14 * shadowVis : 0);
        shadowRef.current.style.transform = `scale(${1 + breath * 1.4 + ease * 0.06}, 1)`;
      }
      // the hole is always fully opaque and opens by scale rather than by
      // fading in, otherwise a grey half shows up on light backgrounds
      const holeT = `scale(${holeK}, ${holeK})`;
      if (holeRef.current) {
        holeRef.current.style.transform = holeT;
        holeRef.current.style.opacity = holeK > 0.001 ? '1' : '0';
      }
      if (lipRef.current) {
        lipRef.current.style.transform = holeT;
        lipRef.current.style.opacity = holeK > 0.001 ? '1' : '0';
      }
      // the bubble follows the cat's motion with a slight lag
      if (bubbleRef.current) {
        const targetY = (bob + (isS ? 3 : 0) + squintK * 5 + jumpY * 0.55) * s.unit;
        const targetR = s.tilt * 0.42;
        const kf = 1 - Math.pow(0.02, dt);
        s.bubY = lerp(s.bubY, targetY, kf);
        s.bubR = lerp(s.bubR, targetR, kf);
        const want = p.bubbleOn ? 1 : 0;
        s.bubV = lerp(s.bubV, want, 1 - Math.pow(6e-4, dt));
        const v = s.bubV;
        const sc = 0.72 + 0.28 * v + 0.07 * Math.sin(Math.PI * v);
        bubbleRef.current.style.opacity = String(v);
        bubbleRef.current.style.transform = `translate(0px, ${s.bubY + (1 - v) * 12}px) rotate(${s.bubR}deg) scale(${sc})`;
      }
      if (tailRef.current) {
        const sway = reduced ? 0 : Math.sin(s.t * (isH ? 3.4 : 1.2)) * (isH ? 14 : 6.5) - (isS ? 14 : 0) - ease * 10;
        tailRef.current.style.transform = `rotate(${sway}deg)`;
      }

      const follow = p.followCursor && !reduced;
      s.pupilX = lerp(s.pupilX, follow ? s.targetPupilX : 0, 1 - Math.pow(8e-4, dt));
      s.pupilY = lerp(s.pupilY, follow ? s.targetPupilY : 0, 1 - Math.pow(8e-4, dt));

      if (p.blink && !reduced) {
        s.blinkAt -= dt;
        if (s.blinkAt <= 0 && s.blinkPhase < 0) {
          s.blinkPhase = 0;
          s.blinkAt = 2.2 + Math.random() * 3.6;
        }
      }
      if (s.blinkPhase >= 0) {
        s.blinkPhase += dt / 0.14;
        s.lid = Math.abs(Math.cos(s.blinkPhase * Math.PI));
        if (s.blinkPhase >= 1) {
          s.blinkPhase = -1;
          s.lid = 1;
        }
      }

      // squinting scales a wrapper around every eye variant, so it works
      // on happy / sad / error too, not only on the neutral face
      const shut = Math.max(ease * 0.94, squintK * 0.92);
      if (eyesWrapRef.current) {
        eyesWrapRef.current.style.transform = `scale(1, ${1 - shut})`;
      }
      if (irisGroupRef.current) {
        irisGroupRef.current.style.transform = `scale(1, ${1 - shut})`;
        irisGroupRef.current.style.opacity = String(s.o.open);
      }
      // blinking and pupil tracking apply to the open eyes only, and the
      // gaze offset fades out with the lids: a shut eye is a line, and a
      // line sliding after the cursor reads as a glitch
      const gaze = Math.max(0, 1 - shut / 0.92);
      const eye = `translate(${s.pupilX * gaze}px, ${s.pupilY * gaze}px) scale(1, ${Math.max(0.06, s.lid)})`;
      if (eyeLRef.current) eyeLRef.current.style.transform = eye;
      if (eyeRRef.current) eyeRRef.current.style.transform = eye;
      if (irisLRef.current) irisLRef.current.style.transform = eye;
      if (irisRRef.current) irisRRef.current.style.transform = eye;
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      io?.disconnect();
      ro?.disconnect();
      mq?.removeEventListener?.('change', onMotionPref);
    };
    // emotionNow/hideCatNow only seed the loop's initial state — live updates
    // flow through `live.current` so the loop and its listeners don't restart
    // every time an emotion or hideCat prop changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entranceOnScroll]);

  return (
    <div
      ref={rootRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        willChange: 'transform, opacity',
        ...style,
      }}
    >
      {showBubbleNow && (
        <div
          ref={bubbleRef}
          style={{
            position: 'relative',
            maxWidth: bubbleWidth,
            marginBottom: bubbleGap,
            opacity: 0,
            transformOrigin: '26% 118%',
            willChange: 'transform, opacity',
            pointerEvents: 'none',
          }}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            style={{
              position: 'absolute',
              left: '22%',
              top: '100%',
              marginTop: -10,
              // the bubble uses box-shadow, the tail is a separate SVG:
              // without a matching filter it vanishes on white
              filter: bubbleShadow
                ? 'drop-shadow(0 6px 10px rgba(0,0,0,.10)) drop-shadow(0 2px 3px rgba(0,0,0,.07))'
                : 'none',
            }}
          >
            <path
              d="M7 4 L22 6 L11 21 Z"
              fill={bubbleColor}
              stroke={bubbleColor}
              strokeWidth="9"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
          <div
            style={{
              position: 'relative',
              background: bubbleColor,
              borderRadius: bubbleRadius,
              // padding in em so it scales with whatever size the font is set to
              padding: '0.85em 1.25em',
              textAlign: 'center',
              lineHeight: 1.3,
              color: textColor,
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
              boxShadow: bubbleShadow ? '0 8px 22px rgba(0,0,0,.10), 0 2px 6px rgba(0,0,0,.06)' : 'none',
              ...font,
            }}
          >
            {messageNow}
          </div>
        </div>
      )}

      <svg
        ref={svgRef}
        viewBox="0 0 268 214"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        onPointerDown={() => {
          if (squintOnClick) pokeRef.current = 1;
        }}
        onKeyDown={(e) => {
          if (squintOnClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            pokeRef.current = 1;
          }
        }}
        tabIndex={squintOnClick ? 0 : undefined}
        style={{ flex: '0 1 auto', overflow: 'visible', cursor: squintOnClick ? 'pointer' : 'default', outline: 'none' }}
        role={squintOnClick ? 'button' : 'img'}
        aria-label={squintOnClick ? 'Cat character, tap to squint' : 'Cat character'}
      >
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="268" height="214">
            <rect x="0" y="0" width="268" height="214" fill="#fff" />
            <g stroke="#000" strokeWidth="3.6" strokeLinecap="round">
              <path d="M32 136 L56 142" />
              <path d="M32 160 L56 156" />
              <path d="M184 136 L160 142" />
              <path d="M184 160 L160 156" />
            </g>
            <g ref={eyesWrapRef} style={{ transformOrigin: '108px 146px' }}>
              <g ref={eyesOpenRef} opacity={pose.open}>
                <g ref={eyeLRef} style={{ transformOrigin: '78px 146px' }}>
                  <ellipse cx="78" cy="146" rx="8.5" ry="11.5" fill="#000" />
                </g>
                <g ref={eyeRRef} style={{ transformOrigin: '140px 146px' }}>
                  <ellipse cx="140" cy="146" rx="8.5" ry="11.5" fill="#000" />
                </g>
              </g>
              <g ref={eyesHappyRef} opacity={pose.happy} fill="none" stroke="#000" strokeWidth="5" strokeLinecap="round">
                <path d="M68 152 Q78 137 88 152" />
                <path d="M130 152 Q140 137 150 152" />
              </g>
              <g ref={eyesSadRef} opacity={pose.sad} fill="#fff">
                <path d="M64 149 L96 135 L96 120 L64 120 Z" />
                <path d="M152 149 L120 135 L120 120 L152 120 Z" />
              </g>
              <g ref={eyesErrorRef} opacity={pose.error} stroke="#000" strokeWidth="4.5" strokeLinecap="round">
                <path d="M70 137 L86 155 M86 137 L70 155" />
                <path d="M132 137 L148 155 M148 137 L132 155" />
              </g>
            </g>
            <g ref={mouthHappyRef} opacity={pose.mHappy} fill="none" stroke="#000" strokeWidth="4.5" strokeLinecap="round">
              <path d="M98 167 Q108 178 118 167" />
            </g>
            <g ref={mouthSadRef} opacity={pose.mSad} fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round">
              <path d="M100 174 Q108 166 116 174" />
            </g>
            <g ref={mouthErrorRef} opacity={pose.mError}>
              <ellipse cx="108" cy="171" rx="6" ry="7.5" fill="#000" />
            </g>
          </mask>
          <clipPath id={clipId}>
            <rect x="-60" y="-140" width="400" height="332" />
          </clipPath>
          {patchColor && (
            <>
              <clipPath id={furClipId}>
                <path d="M34 106 C30 78 38 50 50 34 Q56 27 61 36 C74 52 84 72 88 96 Z" />
                <path d="M182 106 C186 78 178 50 166 34 Q160 27 155 36 C142 52 132 72 128 96 Z" />
                <path d="M108 56 C166 56 202 96 202 140 C202 172 180 186 146 186 L70 186 C36 186 14 172 14 140 C14 96 50 56 108 56 Z" />
              </clipPath>
              <clipPath id={tailClipId}>
                <path d="M 194.9 112.6 L 193.6 109.9 L 192.6 107.2 L 192.0 104.6 L 191.7 102.0 L 191.7 99.4 L 192.0 96.8 L 192.5 94.3 L 193.4 92.0 L 194.5 89.8 L 195.8 87.7 L 197.3 85.9 L 199.0 84.2 L 200.8 82.8 L 202.8 81.7 L 204.9 80.7 L 207.0 80.1 L 209.1 79.7 L 211.3 79.5 L 213.4 79.6 L 215.5 79.9 L 217.5 80.4 L 219.4 81.2 L 221.1 82.2 L 222.8 83.3 L 224.2 84.6 L 225.5 86.0 L 226.5 87.6 L 227.4 89.2 L 228.1 90.9 L 228.5 92.6 L 228.8 94.4 L 228.9 96.1 L 228.7 97.8 L 228.4 99.4 L 227.9 101.0 L 227.2 102.4 L 226.4 103.8 L 225.5 105.0 L 224.4 106.1 L 223.3 107.0 L 222.0 107.8 L 220.8 108.4 L 219.4 108.9 L 216.9 109.2 L 214.2 109.8 L 211.8 111.1 L 209.8 112.9 L 208.3 115.2 L 207.5 117.9 L 207.4 120.6 L 208.0 123.3 L 209.2 125.7 L 211.1 127.7 L 213.4 129.2 L 216.0 130.0 L 218.8 130.1 L 221.3 130.0 L 225.1 129.4 L 228.9 128.3 L 232.6 126.8 L 236.1 124.8 L 239.4 122.4 L 242.4 119.6 L 245.2 116.5 L 247.5 112.9 L 249.5 109.1 L 251.0 105.0 L 252.1 100.8 L 252.7 96.3 L 252.7 91.8 L 252.2 87.2 L 251.2 82.7 L 249.6 78.3 L 247.5 74.0 L 244.9 70.0 L 241.8 66.2 L 238.2 62.8 L 234.3 59.8 L 229.9 57.2 L 225.3 55.1 L 220.3 53.6 L 215.2 52.6 L 209.9 52.3 L 204.6 52.5 L 199.2 53.4 L 193.9 54.9 L 188.8 57.0 L 183.9 59.7 L 179.3 63.1 L 175.1 66.9 L 171.3 71.3 L 168.0 76.1 L 165.2 81.3 L 163.0 86.9 L 161.5 92.8 L 160.6 98.8 L 160.4 105.0 L 160.9 111.3 L 162.1 117.5 L 163.8 123.4 Z" />
              </clipPath>
            </>
          )}
        </defs>

        <ellipse
          ref={shadowRef}
          cx="108"
          cy="192"
          rx="72"
          ry="9"
          fill={furColor}
          opacity={pose.shadow}
          style={{ transformOrigin: '108px 192px' }}
        />
        <ellipse
          ref={holeRef}
          cx="108"
          cy="192"
          rx="80"
          ry="17"
          fill={furColor}
          opacity={0}
          style={{ transformOrigin: '108px 192px' }}
        />
        <g clipPath={`url(#${clipId})`}>
          <g ref={bodyRef} opacity={1} style={{ transformOrigin: '108px 186px' }}>
            <g ref={tailRef} style={{ transformOrigin: '179px 118px' }}>
              <path
                d="M 194.9 112.6 L 193.6 109.9 L 192.6 107.2 L 192.0 104.6 L 191.7 102.0 L 191.7 99.4 L 192.0 96.8 L 192.5 94.3 L 193.4 92.0 L 194.5 89.8 L 195.8 87.7 L 197.3 85.9 L 199.0 84.2 L 200.8 82.8 L 202.8 81.7 L 204.9 80.7 L 207.0 80.1 L 209.1 79.7 L 211.3 79.5 L 213.4 79.6 L 215.5 79.9 L 217.5 80.4 L 219.4 81.2 L 221.1 82.2 L 222.8 83.3 L 224.2 84.6 L 225.5 86.0 L 226.5 87.6 L 227.4 89.2 L 228.1 90.9 L 228.5 92.6 L 228.8 94.4 L 228.9 96.1 L 228.7 97.8 L 228.4 99.4 L 227.9 101.0 L 227.2 102.4 L 226.4 103.8 L 225.5 105.0 L 224.4 106.1 L 223.3 107.0 L 222.0 107.8 L 220.8 108.4 L 219.4 108.9 L 216.9 109.2 L 214.2 109.8 L 211.8 111.1 L 209.8 112.9 L 208.3 115.2 L 207.5 117.9 L 207.4 120.6 L 208.0 123.3 L 209.2 125.7 L 211.1 127.7 L 213.4 129.2 L 216.0 130.0 L 218.8 130.1 L 221.3 130.0 L 225.1 129.4 L 228.9 128.3 L 232.6 126.8 L 236.1 124.8 L 239.4 122.4 L 242.4 119.6 L 245.2 116.5 L 247.5 112.9 L 249.5 109.1 L 251.0 105.0 L 252.1 100.8 L 252.7 96.3 L 252.7 91.8 L 252.2 87.2 L 251.2 82.7 L 249.6 78.3 L 247.5 74.0 L 244.9 70.0 L 241.8 66.2 L 238.2 62.8 L 234.3 59.8 L 229.9 57.2 L 225.3 55.1 L 220.3 53.6 L 215.2 52.6 L 209.9 52.3 L 204.6 52.5 L 199.2 53.4 L 193.9 54.9 L 188.8 57.0 L 183.9 59.7 L 179.3 63.1 L 175.1 66.9 L 171.3 71.3 L 168.0 76.1 L 165.2 81.3 L 163.0 86.9 L 161.5 92.8 L 160.6 98.8 L 160.4 105.0 L 160.9 111.3 L 162.1 117.5 L 163.8 123.4 Z"
                fill={furColor}
              />
              {patchColor && (
                <g clipPath={`url(#${tailClipId})`}>
                  <ellipse cx="210" cy="60" rx="8" ry="6.5" fill={patchColor} />
                </g>
              )}
            </g>
            <g mask={`url(#${maskId})`} fill={furColor}>
              <path d="M34 106 C30 78 38 50 50 34 Q56 27 61 36 C74 52 84 72 88 96 Z" />
              <path d="M182 106 C186 78 178 50 166 34 Q160 27 155 36 C142 52 132 72 128 96 Z" />
              <path d="M108 56 C166 56 202 96 202 140 C202 172 180 186 146 186 L70 186 C36 186 14 172 14 140 C14 96 50 56 108 56 Z" />
            </g>
            {patchColor && (
              <g clipPath={`url(#${furClipId})`}>
                <ellipse cx="76" cy="102" rx="15" ry="12" fill={patchColor} />
                <ellipse cx="140" cy="102" rx="15" ry="12" fill={patchColor} />
              </g>
            )}
            {eyeColor && (
              <g ref={irisGroupRef} opacity={pose.open} style={{ transformOrigin: '108px 146px' }}>
                <g ref={irisLRef} style={{ transformOrigin: '78px 146px' }}>
                  <ellipse cx="78" cy="146" rx="8.5" ry="11.5" fill={eyeColor} />
                </g>
                <g ref={irisRRef} style={{ transformOrigin: '140px 146px' }}>
                  <ellipse cx="140" cy="146" rx="8.5" ry="11.5" fill={eyeColor} />
                </g>
              </g>
            )}
          </g>
        </g>
        <path
          ref={lipRef}
          d="M28 192 A80 17 0 0 0 188 192 Z"
          fill={furColor}
          opacity={0}
          style={{ transformOrigin: '108px 192px' }}
        />
      </svg>
    </div>
  );
}
