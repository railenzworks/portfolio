'use client';

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import styles from './Picture.module.css';

export interface PictureProps {
  /** the picture; without it the slot shows a placeholder */
  src?: string;
  /** what the picture shows (alt text, and what the placeholder asks for) */
  alt: string;
  /** file name to save the picture as (shown on the placeholder) */
  file: string;
  /** CSS aspect-ratio of the box, e.g. "4 / 5" */
  ratio: string;
  caption?: string;
  /** text of the placeholder's label */
  pending: string;
  position?: string;
  /** show the whole picture on a plain background instead of cropping it */
  contain?: boolean;
  sizes?: string;
  priority?: boolean;
  /**
   * Take the height of the space around it (beside a text) instead of the ratio:
   * the box is as tall as the text next to it, and the picture is cropped to fit.
   * On phones, where it sits under the text, the ratio is used again.
   */
  fill?: boolean;
  /**
   * Click to see it larger, whole, over the blurred page. The texts are the
   * cursor's label and the close button's name. Leave it out for the pictures
   * that are not meant to be enlarged (the diagrams).
   */
  zoom?: { open: string; close: string };
  /** no growing under the cursor (the hover effect of the other pictures) */
  still?: boolean;
}

// One picture of a project page, in a rounded card with the same hairline frame
// as the cover. Works with or without the picture: an empty slot is a quiet
// placeholder that says what goes there, so the layout can be judged (and the
// pictures dropped in later) without changing any code but lib/project-pages.ts.
export function Picture({
  src,
  alt,
  file,
  ratio,
  caption,
  pending,
  position,
  contain,
  sizes = '(max-width: 760px) 100vw, 60vw',
  priority,
  fill,
  zoom,
  still,
}: PictureProps) {
  const [open, setOpen] = useState(false);
  // the picture's own size, read once it has loaded, so the enlarged one is shown whole
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const canZoom = !!zoom && !!src;

  // while it is open: Esc closes, the page behind doesn't scroll, focus goes to
  // the close button and comes back to the picture afterwards
  useEffect(() => {
    if (!open) return;
    const frame = frameRef.current;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      frame?.focus({ preventScroll: true });
    };
  }, [open]);

  const onFrameKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
    }
  };

  // size of the enlarged picture: as large as the window allows, but never more
  // than 1.6 times its own pixels (it would just get blurry)
  const [rw, rh] = ratio.split('/').map((n) => parseFloat(n));
  const w = natural?.w ?? (rw || 4) * 200;
  const h = natural?.h ?? (rh || 5) * 200;

  return (
    <figure className={`${styles.fig} ${fill ? styles.fill : ''}`}>
      <div
        ref={frameRef}
        className={`${styles.frame} ${contain ? styles.contain : ''} ${canZoom ? styles.zoomable : ''} ${still ? styles.still : ''}`}
        style={{ '--ratio': ratio } as CSSProperties}
        {...(canZoom && {
          role: 'button',
          tabIndex: 0,
          'aria-haspopup': 'dialog',
          'aria-label': `${zoom.open}: ${alt}`,
          onClick: () => setOpen(true),
          onKeyDown: onFrameKey,
        })}
      >
        {src ? (
          <Image
            src={src}
            alt={canZoom ? '' : alt}
            fill
            sizes={sizes}
            quality={90}
            priority={priority}
            className={styles.img}
            style={{ objectFit: contain ? 'contain' : 'cover', objectPosition: position }}
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img.naturalWidth) setNatural({ w: img.naturalWidth, h: img.naturalHeight });
            }}
          />
        ) : (
          <div className={styles.hint} role="img" aria-label={`${pending}: ${alt}`}>
            <svg className={styles.icon} width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="9" cy="10" r="1.7" stroke="currentColor" strokeWidth="1.4" />
              <path
                d="M4 17.5l4.6-4.6a1.4 1.4 0 0 1 2 0L15 17.2m-1.6-1.6l1.2-1.2a1.4 1.4 0 0 1 2 0l2.4 2.4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className={styles.label}>{pending}</span>
            <span className={styles.what}>{alt}</span>
            <span className={styles.file}>{file}</span>
          </div>
        )}
        {src && <div className={styles.grain} />}
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}

      {/* in the body, so no transform or filter of the page can shrink the "fixed" overlay */}
      {open &&
        src &&
        zoom &&
        createPortal(
          <div
            className={styles.lb}
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            onClick={() => setOpen(false)}
            // the arrows of a carousel behind must not react while this is open
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === 'Tab') {
                e.preventDefault();
                closeRef.current?.focus();
              }
            }}
          >
            <button ref={closeRef} type="button" className={styles.lbClose} aria-label={zoom.close} onClick={() => setOpen(false)}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            <Image
              src={src}
              alt={alt}
              width={w}
              height={h}
              sizes="92vw"
              quality={90}
              className={styles.lbImg}
              style={{ '--r': w / h, '--nw': w } as CSSProperties}
            />
          </div>,
          document.body,
        )}
    </figure>
  );
}
