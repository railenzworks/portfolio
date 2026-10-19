'use client';

import { useEffect, useState } from 'react';
import { useLang } from './LangProvider';
import styles from './ThemeToggle.module.css';

type Theme = 'light' | 'dark';

// Light/dark switch styled like the nav pill: an orange sun slides across and
// turns into a blue crescent moon. The theme itself lives on <html data-theme>,
// set before paint by the inline script in layout.tsx; the knob's look reads
// that attribute in CSS, so it's right on first paint without animating in.
export function ThemeToggle() {
  // unknown until mounted: the server can't know the visitor's theme
  const [theme, setTheme] = useState<Theme | null>(null);
  const { t } = useLang();

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    root.classList.add('theme-fade');
    root.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {}
    setTheme(next);
    window.setTimeout(() => root.classList.remove('theme-fade'), 600);
  };

  const dark = theme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={t.controls.darkMode}
      className={styles.toggle}
      onClick={toggle}
    >
      <span className={styles.knob} aria-hidden="true" data-no-fade />
    </button>
  );
}
