'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './AboutGallery.module.css';

export interface GalleryPhoto {
  src: string;
  caption: string;
  /** CSS object-position, to keep the subject in the tile when the photo is cropped. */
  position?: string;
}

// Tiles per column and how tall each is at rest (flex-grow): two in the first
// column, three in the second.
const COLS = [[1, 1], [1, 1, 1]];

// A bento gallery of five pictures. The one under the cursor grows (taking
// width from the other columns and height from the others in its column), the
// rest turn grey, and its caption shows. It's only for looking at: the
// pictures don't open or filter.
export function AboutGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [active, setActive] = useState<number | null>(null);

  let n = 0;
  return (
    <div className={styles.gallery} onPointerLeave={() => setActive(null)}>
      {COLS.map((grows, r) => {
        const first = n;
        const colActive = active !== null && active >= first && active < first + grows.length;
        return (
          <div key={r} className={styles.col} style={{ flexGrow: colActive ? 2.3 : 1 }}>
            {grows.map((grow) => {
              const i = n++;
              const photo = photos[i];
              if (!photo) return null;
              const on = active === i;
              return (
                <div
                  key={photo.src}
                  className={`${styles.tile} ${active !== null && !on ? styles.dim : ''}`}
                  style={{ flexGrow: on ? grow * 2 : grow }}
                  tabIndex={0}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                >
                  <Image
                    src={photo.src}
                    alt={photo.caption}
                    fill
                    sizes={i === 0 ? '450px' : '300px'}
                    quality={90}
                    priority={i === 0}
                    style={{ objectFit: 'cover', objectPosition: photo.position }}
                  />
                  <span className={`${styles.caption} ${on ? styles.captionOn : ''}`}>{photo.caption}</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
