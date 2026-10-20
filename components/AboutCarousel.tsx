'use client';

import { useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import styles from './AboutCarousel.module.css';

export interface CarouselImage {
  src: string;
  alt: string;
  /** 'contain' for cut-outs on a transparent background, 'cover' for full pictures. */
  fit?: 'contain' | 'cover';
  /** `sizes` for this image when it's drawn wider than the card (default 300px). */
  sizes?: string;
  /** Extra CSS transform for the picture inside the card, to zoom in and
      re-centre a subject that sits off to one side of the photo. */
  frame?: string;
}

interface AboutCarouselProps {
  images: CarouselImage[];
  /** aria-label of the "next image" button */
  nextLabel: string;
  /** The text shown next to the deck. */
  children: ReactNode;
}

// Where each card rests in the fanned deck: the top one straight, the ones
// behind tilted (around their centre) and shifted to the left, each a bit
// smaller than the last. x/y are px on a 450×650 card, scaled to the real size.
const SLOTS = [
  { r: 0, x: 0, y: 0, s: 1 },
  { r: -5, x: -10, y: 8, s: 0.97 },
  { r: -10, x: -18, y: 14, s: 0.94 },
  { r: -14, x: -24, y: 18, s: 0.91 },
  { r: -17, x: -28, y: 22, s: 0.88 },
];

// the top card swinging off to the right before it drops to the back
const OUT = 'translate(48%, -3%) rotate(7deg) scale(0.97)';
// how long the card stays out before going behind the deck, and the whole move
const OUT_MS = 420;
const MOVE_MS = 900;

const slotTransform = (place: number) => {
  const s = SLOTS[Math.min(place, SLOTS.length - 1)];
  return `translate(${(s.x / 450) * 100}%, ${(s.y / 650) * 100}%) rotate(${s.r}deg) scale(${s.s})`;
};

// A fanned deck of cards: "next" swings the top card off to the right and
// slips it back in at the bottom of the deck, so the pictures go round.
export function AboutCarousel({ images, nextLabel, children }: AboutCarouselProps) {
  const count = images.length;
  // the card at the top of the deck; card i sits (i - top) places below it
  const [top, setTop] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const busy = useRef(false);

  const next = () => {
    if (busy.current || count < 2) return;
    busy.current = true;
    setLeaving(top);
    setTimeout(() => {
      setTop((t) => (t + 1) % count);
      setLeaving(null);
    }, OUT_MS);
    setTimeout(() => { busy.current = false; }, MOVE_MS);
  };

  return (
    <section className={`${styles.layout} wrap`}>
      <div className={styles.carousel}>
        <div className={styles.deck}>
          {images.map((img, i) => {
            const place = (i - top + count) % count;
            const out = i === leaving;
            return (
              <div
                key={img.src}
                className={styles.card}
                style={{
                  zIndex: out ? count + 1 : count - place,
                  transform: out ? OUT : slotTransform(place),
                }}
                aria-hidden={place !== 0}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes={img.sizes ?? '300px'}
                  quality={90}
                  priority={place === 0}
                  style={
                    img.fit === 'contain'
                      ? { objectFit: 'contain', objectPosition: 'center bottom', padding: '8% 6% 0' }
                      : { objectFit: 'cover', transform: img.frame }
                  }
                />
                <div className={styles.grain} aria-hidden />
              </div>
            );
          })}

          {count > 1 && (
            <button type="button" className={styles.next} onClick={next} aria-label={nextLabel} data-cursor-blue>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8H13" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
                <path
                  d="M9.25 4.25L13 8L9.25 11.75"
                  stroke="currentColor"
                  strokeWidth="1.35"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>

        <div className={styles.dots} aria-hidden>
          {images.map((img, i) => (
            <span key={img.src} className={`${styles.dot} ${i === top ? styles.dotOn : ''}`} />
          ))}
        </div>
      </div>
      <div className={styles.text}>{children}</div>
    </section>
  );
}
