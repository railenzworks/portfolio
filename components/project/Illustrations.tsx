'use client';

import { useState, type KeyboardEvent } from 'react';
import { Arrow } from './Arrow';
import { Picture, type PictureProps } from './Picture';
import styles from './Illustrations.module.css';

export interface IllustrationItem {
  id: string;
  /** short name (the acronym, when there is a full name) */
  name: string;
  /** full name, under the short one */
  full?: string;
  portrait: Omit<PictureProps, 'pending' | 'caption'>;
  entity: Omit<PictureProps, 'pending' | 'caption'>;
}

interface IllustrationsProps {
  items: IllustrationItem[];
  labels: {
    disorders: string;
    portrait: string;
    entity: string;
    pending: string;
    prev: string;
    next: string;
    zoom: string;
    close: string;
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

// One disorder at a time, as in the home's carousel: round arrows (teal back,
// blue forward), a counter and, under the pictures, the dots of the About page.
// Each disorder shows its two drawings: the digital portrait and the charcoal
// entity. The pair fades in each time it changes; ← → work from the keyboard.
export function Illustrations({ items, labels }: IllustrationsProps) {
  const [index, setIndex] = useState(0);
  const count = items.length;
  const current = items[index];
  if (!current) return null;

  const go = (i: number) => setIndex((i + count) % count);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(index - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(index + 1);
    }
  };

  return (
    <div className={styles.wrap} role="group" aria-label={labels.disorders} onKeyDown={onKeyDown}>
      <div className={styles.bar}>
        <div className={styles.title} aria-live="polite">
          {current.full ? (
            <>
              <span className={styles.short}>{current.name}</span>
              <span className={styles.name}>{current.full}</span>
            </>
          ) : (
            <span className={styles.name}>{current.name}</span>
          )}
        </div>

        <div className={styles.controls}>
          <span className={styles.counter}>
            {pad(index + 1)} / {pad(count)}
          </span>
          <button type="button" className={styles.prev} onClick={() => go(index - 1)} aria-label={labels.prev}>
            <Arrow left />
          </button>
          <button type="button" className={styles.next} onClick={() => go(index + 1)} aria-label={labels.next}>
            <Arrow />
          </button>
        </div>
      </div>

      <div className={styles.pair} key={current.id}>
        <Picture
          {...current.portrait}
          pending={labels.pending}
          zoom={{ open: labels.zoom, close: labels.close }}
          caption={labels.portrait}
          sizes="(max-width: 760px) 50vw, 30vw"
        />
        <Picture
          {...current.entity}
          pending={labels.pending}
          zoom={{ open: labels.zoom, close: labels.close }}
          caption={labels.entity}
          sizes="(max-width: 760px) 50vw, 30vw"
        />
      </div>

      <div className={styles.dots}>
        {items.map((it, i) => (
          <button
            key={it.id}
            type="button"
            className={`${styles.dot} ${i === index ? styles.dotOn : ''}`}
            aria-label={it.full ?? it.name}
            aria-current={i === index}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
