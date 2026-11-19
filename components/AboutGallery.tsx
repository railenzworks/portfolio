'use client';

import { useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { TransitionLink } from './TransitionLink';
import styles from './AboutGallery.module.css';

/** Text laid over a tile, card style: a glass tag on top, title and text at the bottom. */
export interface GalleryCard {
  tag: string;
  title: string;
  desc: string;
  meta: string;
  /** colour the bottom gradient fades into, and the text colour on it */
  tint: string;
  onTint: string;
}

export interface GalleryPhoto {
  src: string;
  caption: string;
  /** CSS object-position, to keep the subject in the tile when the photo is cropped. */
  position?: string;
  /** more pictures shown side by side with `src`, in equal columns */
  more?: string[];
  /** shown over the picture instead of the hover caption */
  card?: GalleryCard;
  /**
   * Makes the tile a link. In wip mode a tile with `href` is the finished one:
   * no frosted glass, and the cursor shows `wip.open` instead of the WIP label.
   */
  href?: string;
}

// Tiles per column and how tall each is at rest (flex-grow): two in the first
// column, three in the second.
const COLS = [[1, 1], [1, 1, 1]];

interface AboutGalleryProps {
  photos: GalleryPhoto[];
  /** Tiles per column and their resting heights (flex-grow). Defaults to 2 + 3. */
  cols?: number[][];
  /** Extra class for the gallery box (e.g. to change its aspect ratio). */
  className?: string;
  /**
   * Unfinished content: the pictures sit behind frosted glass and the cursor
   * shows `wip.cursor` over them (pictures with an `href` are open instead, see
   * GalleryPhoto, and show `wip.open`).
   */
  wip?: { cursor: string; open: string };
  /**
   * How much the hovered picture grows: `col` is the flex-grow of its column
   * (1 = no change) and `tile` the multiplier of its own height. Defaults to
   * the bold growth of the Experience gallery.
   */
  growth?: { col: number; tile: number };
}

// A bento gallery of pictures. The one under the cursor grows (taking width
// from the other columns and height from the others in its column), the rest
// turn grey, and its caption shows. It's only for looking at: the pictures
// don't open or filter.
export function AboutGallery({ photos, cols = COLS, className, wip, growth = { col: 2.3, tile: 2 } }: AboutGalleryProps) {
  const [active, setActive] = useState<number | null>(null);

  let n = 0;
  return (
    <div
      className={`${styles.gallery} ${className ?? ''}`}
      onPointerLeave={() => setActive(null)}
    >
      {cols.map((grows, r) => {
        const first = n;
        const colActive = active !== null && active >= first && active < first + grows.length;
        return (
          <div key={r} className={styles.col} style={{ flexGrow: colActive ? growth.col : 1 }}>
            {grows.map((grow) => {
              const i = n++;
              const photo = photos[i];
              if (!photo) return null;
              const on = active === i;
              // in wip mode, a tile with a link is the finished one
              const locked = !!wip && !photo.href;
              const tileProps = {
                // the others turn grey while one is looked at, except in wip mode,
                // where the hovered one loses its glass instead
                className: `${styles.tile} ${!wip && active !== null && !on ? styles.dim : ''} ${on ? styles.on : ''}`,
                style: { flexGrow: on ? grow * growth.tile : grow },
                onPointerEnter: () => setActive(i),
                onFocus: () => setActive(i),
                onBlur: () => setActive(null),
                ...(wip && { 'data-cursor': 'view', 'data-label': locked ? wip.cursor : wip.open }),
                // the "Open" label of a finished one is blue
                ...(wip && !locked && { 'data-label-blue': '' }),
              };
              const tile = (
                <>
                  {/* a picture, or several side by side in equal columns (like ProjectCover) */}
                  <div className={styles.pics}>
                    {[photo.src, ...(photo.more ?? [])].map((src, k, all) => (
                      <div key={src} className={styles.pic}>
                        <Image
                          src={src}
                          alt={k === 0 ? photo.caption : ''}
                          fill
                          // the works tiles are bigger than the experience ones
                          sizes={
                            wip
                              ? `(max-width: 760px) ${Math.ceil(50 / all.length)}vw, ${Math.ceil(45 / all.length)}vw`
                              : i === 0 ? '450px' : '300px'
                          }
                          quality={90}
                          priority={i === 0}
                          style={{ objectFit: 'cover', objectPosition: photo.position }}
                        />
                      </div>
                    ))}
                  </div>
                  {locked && <span className={styles.glass} aria-hidden="true" />}
                  {/* phones have no cursor to say it is a work in progress: a small text in the middle */}
                  {locked && <span className={styles.wipTag}>{wip.cursor}</span>}
                  {photo.card ? (
                    // text anchored to the tile's corners: it moves with the tile
                    // and keeps its size and alignment while the tile grows or shrinks
                    <div
                      className={styles.card}
                      style={{ '--tint': photo.card.tint, '--on-tint': photo.card.onTint } as CSSProperties}
                    >
                      <span className={styles.tag}>{photo.card.tag}</span>
                      <div className={styles.cardBottom}>
                        <h2 className={styles.cardTitle}>{photo.card.title}</h2>
                        {/* collapsed at rest, so the title sits at the bottom; it opens
                            under the cursor and pushes the title up */}
                        <div className={styles.cardMore}>
                          <div className={styles.cardMoreInner}>
                            <p className={styles.cardDesc}>{photo.card.desc}</p>
                            <span className={styles.cardMeta}>{photo.card.meta}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className={`${styles.caption} ${on ? styles.captionOn : ''}`}>{photo.caption}</span>
                  )}
                </>
              );
              return photo.href ? (
                <TransitionLink key={photo.src} href={photo.href} {...tileProps}>
                  {tile}
                </TransitionLink>
              ) : (
                <div key={photo.src} tabIndex={0} {...tileProps}>
                  {tile}
                </div>
              );
            })}
          </div>
        );
      })}

    </div>
  );
}
