'use client';

import { useEffect, useRef, useState } from 'react';
import { useLang } from './LangProvider';
import styles from './SeasonPicker.module.css';

type Season = 'summer' | 'spring' | 'autumn' | 'winter' | 'main';

// [teal, blue] for the swatches: keep in sync with the
// :root[data-season] blocks in globals.css
const SEASONS: { id: Season; colors: [string, string] }[] = [
  { id: 'summer', colors: ['#f5c842', '#ff6f61'] },
  { id: 'spring', colors: ['#eaa9bd', '#5e9e3f'] },
  { id: 'autumn', colors: ['#e8873a', '#8b3a2b'] },
  { id: 'winter', colors: ['#a9d3f0', '#5f7891'] },
  { id: 'main', colors: ['#8ad2d4', '#3a67f0'] },
];

// "Theme" pill next to the light/dark switch: a dropdown that swaps the two
// corporate colours (teal and blue). The choice lives on <html data-season> ("main" = none),
// set before paint by the inline script in layout.tsx.
export function SeasonPicker() {
  const [open, setOpen] = useState(false);
  const { t } = useLang();
  const [season, setSeason] = useState<Season | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setSeason((document.documentElement.dataset.season as Season | undefined) ?? 'main');
  }, []);

  // close on a click outside or on Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const pick = (next: Season) => {
    const root = document.documentElement;
    root.classList.add('theme-fade');
    if (next === 'main') delete root.dataset.season;
    else root.dataset.season = next;
    try {
      localStorage.setItem('season', next);
    } catch {}
    setSeason(next);
    setOpen(false);
    window.setTimeout(() => root.classList.remove('theme-fade'), 600);
  };

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        ref={triggerRef}
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {t.controls.theme}
        <svg className={`${styles.chev} ${open ? styles.chevOpen : ''}`} viewBox="0 0 10 6" aria-hidden="true">
          <path d="M1 1l4 4 4-4" />
        </svg>
      </button>

      <div className={`${styles.menu} ${open ? styles.menuOpen : ''}`} role="menu" aria-label={t.controls.theme}>
        {SEASONS.map(({ id, colors }) => (
          <button
            key={id}
            type="button"
            role="menuitemradio"
            aria-checked={season === id}
            tabIndex={open ? 0 : -1}
            className={styles.item}
            onClick={() => pick(id)}
          >
            <span className={styles.swatch} aria-hidden="true">
              <span style={{ background: colors[0] }} />
              <span style={{ background: colors[1] }} />
            </span>
            {t.controls.seasons[id]}
          </button>
        ))}
      </div>
    </div>
  );
}
