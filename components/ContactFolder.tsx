'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useLang } from './LangProvider';
import styles from './ContactFolder.module.css';

export const CONTACT_EVENT = 'open-contact';
const EMAIL = 'railenzworks@gmail.com';

// how long the sheet takes to slide out of the folder before it comes back
// round to lie on top (keep in step with the .paper transition)
const SLIDE_OUT_MS = 900;

type Stage = 'closed' | 'out' | 'front';

// Every link to /contact (see TransitionLink) fires CONTACT_EVENT instead of
// navigating: the page blurs and a blue folder appears. On hover the cover
// opens a little and the sheet inside peeks out; on click the sheet slides
// all the way out to the right, the cover shuts, and the sheet comes back to
// lie on top of the folder with the contact button. Escape, the close button
// or a click on the blurred page closes it.
export function ContactFolder() {
  const { t } = useLang();
  const f = t.folder;
  const [shown, setShown] = useState(false);
  const [stage, setStage] = useState<Stage>('closed');
  const folderRef = useRef<HTMLButtonElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const timer = useRef<number>(undefined);

  useEffect(() => {
    const show = () => {
      returnTo.current = document.activeElement as HTMLElement | null;
      window.clearTimeout(timer.current);
      setStage('closed');
      setShown(true);
    };
    window.addEventListener(CONTACT_EVENT, show);
    return () => window.removeEventListener(CONTACT_EVENT, show);
  }, []);

  const close = () => {
    window.clearTimeout(timer.current);
    setShown(false);
    returnTo.current?.focus();
  };

  // while shown: Escape closes, the page behind doesn't scroll
  useEffect(() => {
    if (!shown) return;
    folderRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [shown]);

  const open = () => {
    if (stage !== 'closed') return;
    setStage('out');
    timer.current = window.setTimeout(() => {
      setStage('front');
      // focus the button once the sheet has settled
      timer.current = window.setTimeout(() => ctaRef.current?.focus(), 900);
    }, SLIDE_OUT_MS);
  };

  return (
    <div
      className={`${styles.overlay} ${shown ? styles.shown : ''}`}
      onClick={(e) => e.target === e.currentTarget && close()}
      aria-hidden={!shown}
      inert={!shown}
    >
      <button type="button" className={styles.close} onClick={close} aria-label={f.close}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <div className={styles.stage} role="dialog" aria-modal="true" aria-label={f.label}>
        <div className={styles.folder} data-stage={stage}>
          <div className={styles.back} />

          <div className={styles.paper}>
            <span className={styles.tab}>{f.tab}</span>
            {/* María's illustrated portrait, filling the top of the sheet;
                the text sits below it, just above the button */}
            <div className={styles.portrait}>
              <Image src="/images/maria-cut.png" alt="" fill sizes="200px" style={{ objectFit: 'contain' }} />
            </div>
            <h2 className={styles.title}>{f.title}</h2>
            <p className={styles.body}>{f.body}</p>
            <a
              ref={ctaRef}
              href={`mailto:${EMAIL}`}
              className={`btn btn--solid ${styles.cta}`}
              tabIndex={stage === 'front' ? 0 : -1}
            >
              <span>{f.cta}</span>
            </a>
          </div>

          <div className={styles.cover}>
            {/* the name, set like the home page's hero, in white */}
            <div className={styles.name} aria-hidden="true">
              <span>MARÍA</span>
              <span>RAILENZ</span>
            </div>
            <div className={styles.coverText}>
              <span className={styles.coverTitle}>{f.coverTitle}</span>
              <span className={styles.coverSub}>{f.coverSub}</span>
            </div>
          </div>

          {/* the whole closed folder is the button that opens it */}
          <button
            ref={folderRef}
            type="button"
            className={styles.hit}
            onClick={open}
            aria-label={f.hint}
            tabIndex={stage === 'closed' ? 0 : -1}
          />
        </div>
      </div>
    </div>
  );
}
