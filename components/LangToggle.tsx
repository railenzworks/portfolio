'use client';

import { useLang } from './LangProvider';
import styles from './LangToggle.module.css';

// ENG / ESP switch, the same 24px glass pill as the light/dark switch:
// a filled pill slides under the active language.
export function LangToggle() {
  const { lang, t, setLang } = useLang();
  const es = lang === 'es';

  return (
    <button
      type="button"
      className={`${styles.toggle} ${es ? styles.es : ''}`}
      aria-label={`${t.controls.language}: ${es ? 'Español' : 'English'}`}
      onClick={() => setLang(es ? 'en' : 'es')}
    >
      <span className={styles.pill} aria-hidden="true" data-no-fade />
      <span className={`${styles.opt} ${!es ? styles.on : ''}`} lang="en">ENG</span>
      <span className={`${styles.opt} ${es ? styles.on : ''}`} lang="es">ESP</span>
    </button>
  );
}
