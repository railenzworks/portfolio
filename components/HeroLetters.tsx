'use client';

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useLang } from './LangProvider';
import styles from './HeroLetters.module.css';

const LINE1 = 'MARÍA';
const LINE2 = 'RAILENZ';

// Set once the scroll intro has been played all the way through. It lasts as
// long as the tab, so coming back to the home shows the finished hero (the name
// assembled, no scroll needed) instead of playing it again.
const SEEN_KEY = 'heroSeen';

function seededRandom(seed: number) {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
}

type LetterMeta = { char: string; dx: number; dy: number; rot: number; scale: number };

// Places letters around a ring, evenly spaced by angle, so a purely random
// scatter can't cluster two letters on top of each other.
function buildScatter(chars: string[]): LetterMeta[] {
  const total = chars.length;
  const angleStep = 360 / total;
  return chars.map((char, i) => {
    const s = i + 1;
    const angleJitter = (seededRandom(s * 1.7) - 0.5) * 2 * (angleStep * 0.3);
    const angle = (i * angleStep + angleJitter) * (Math.PI / 180);
    const radiusX = 22 + seededRandom(s * 2.3) * 11;
    const radiusY = 15 + seededRandom(s * 3.1) * 9;
    const dx = Math.cos(angle) * radiusX;
    const dy = Math.sin(angle) * radiusY;
    const rot = (seededRandom(s * 3.9) - 0.5) * 2 * 55;
    const scale = 0.36 + seededRandom(s * 5.1) * 0.22;
    return { char, dx, dy, rot, scale };
  });
}

export function HeroLetters() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);
  const scrollIconRef = useRef<HTMLDivElement>(null);

  const scatter = useMemo(() => buildScatter([...LINE1, ...LINE2]), []);
  const line1 = scatter.slice(0, LINE1.length);
  const line2 = scatter.slice(LINE1.length);

  // Coming back to the home by a link (no page load, so the script in layout.tsx
  // didn't run): mark <html> before the first paint, so the hero's scroll
  // distance is already gone. The CSS does the rest (see HeroLetters.module.css).
  useLayoutEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY) === '1') document.documentElement.dataset.heroSeen = '1';
    } catch {}
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const l1 = line1Ref.current;
    const l2 = line2Ref.current;
    const statement = statementRef.current;
    const scrollIcon = scrollIconRef.current;
    if (!section || !l1 || !l2 || !statement || !scrollIcon) return;

    const letters = [
      ...(Array.from(l1.children) as HTMLElement[]),
      ...(Array.from(l2.children) as HTMLElement[]),
    ];

    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
      const ip = 1 - p;

      // Played to the end: remember it for the rest of the tab. It only takes effect
      // the next time the home is shown, so the page doesn't shrink under the reader.
      if (p >= 1) {
        try {
          sessionStorage.setItem(SEEN_KEY, '1');
        } catch {}
      }

      // Letters stay fully hidden until scrolling begins, then fade in over
      // the first slice of progress so there's no jump cut.
      const enter = Math.min(1, p / 0.08);

      letters.forEach((el, i) => {
        const m = scatter[i];
        el.style.transform = `translate(${m.dx * ip}vw, ${m.dy * ip}vh) rotate(${m.rot * ip}deg) scale(${m.scale + (1 - m.scale) * p})`;
        el.style.opacity = String(enter * (0.3 + 0.7 * p));
      });

      scrollIcon.style.opacity = String(1 - enter);
      scrollIcon.style.transform = `translate(-50%, calc(-50% - ${enter * 18}px))`;

      const reveal = Math.min(1, Math.max(0, (p - 0.72) / 0.28));
      statement.style.opacity = String(reveal);
      statement.style.transform = `translateY(${(1 - reveal) * 24}px)`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [scatter]);

  return (
    <section className={styles.scrub} ref={sectionRef}>
      <div className={styles.sticky}>
        <div className={styles.nameWrap}>
          <div className={styles.line} ref={line1Ref}>
            {line1.map((l, i) => (
              <span key={i} className={styles.letter}>{l.char}</span>
            ))}
          </div>
          <div className={styles.line} ref={line2Ref}>
            {line2.map((l, i) => (
              <span key={i} className={`${styles.letter} ${styles.line2}`}>{l.char}</span>
            ))}
          </div>
        </div>

        <p className={styles.statement} ref={statementRef}>
          {t.hero.design}<b className={styles.amp}>&amp;</b>{t.hero.illustration}
          <br />
          {t.hero.arts}<b className={styles.amp}>&amp;</b>{t.hero.cats}
        </p>

        <div className={styles.scrollIcon} ref={scrollIconRef}>
          <span className={styles.scrollIconMouse} />
          <span className={styles.scrollIconLabel}>{t.hero.scroll}</span>
        </div>
      </div>
    </section>
  );
}
