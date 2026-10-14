'use client';

import Image from 'next/image';
import { useCallback, useState, type MouseEvent } from 'react';
import type { Project, Discipline } from '@/lib/projects';
import { TransitionLink } from './TransitionLink';
import styles from './FeaturedTabs.module.css';

const DISC_LABEL: Record<Discipline, string> = {
  illustration: 'Illustration',
  graphic: 'Graphic Design',
};

const PIP_COLOR: Record<Discipline, string> = {
  illustration: 'var(--teal)',
  graphic: 'var(--blue)',
};

function Arrow({ left = false }: { left?: boolean }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={left ? { transform: 'rotate(180deg)' } : undefined}
    >
      <path d="M3 8H13" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      <path
        d="M9.25 4.25L13 8L9.25 11.75"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface FeaturedTabsProps {
  projects: Project[];
  totalProjects: number;
}

export function FeaturedTabs({ projects, totalProjects }: FeaturedTabsProps) {
  const [active, setActive] = useState(0);
  const count = projects.length;
  const current = projects[active];

  const next = useCallback(() => setActive((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setActive((i) => (i - 1 + count) % count), [count]);

  // Hover parallax: the image drifts slightly away from the cursor.
  const onMediaMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', String((e.clientX - r.left) / r.width - 0.5));
    e.currentTarget.style.setProperty('--my', String((e.clientY - r.top) / r.height - 0.5));
  };
  const onMediaLeave = (e: MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.setProperty('--mx', '0');
    e.currentTarget.style.setProperty('--my', '0');
  };

  if (!current) return null;
  const single = count === 1;

  return (
    <div className={`${styles.root} ${single ? styles.single : ''} reveal`}>
      <TransitionLink
        href={`/works#${current.id}`}
        className={styles.media}
        data-cursor="view"
        data-label="Open"
        aria-label={`Open ${current.title}`}
        onMouseMove={onMediaMove}
        onMouseLeave={onMediaLeave}
      >
        {projects.map((p, i) => (
          <div
            key={p.id}
            className={`${styles.img} ${i === active ? styles.imgOn : ''}`}
            aria-hidden={i !== active}
          >
            <Image
              src={p.img}
              alt={p.title}
              fill
              sizes="(max-width: 760px) 100vw, 68vw"
              style={{ objectFit: 'cover' }}
              priority={i === 0}
            />
          </div>
        ))}
        <div className={styles.grain} />
      </TransitionLink>

      <div className={styles.card}>
        {!single && (
        <div className={styles.tabs} role="tablist" aria-label="Selected works">
          {projects.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`${styles.tab} ${i === active ? styles.tabOn : ''}`}
              onClick={() => setActive(i)}
            >
              {p.title}
            </button>
          ))}
        </div>
        )}

        <div className={styles.body} key={current.id}>
          <div className={styles.eyebrow}>
            <span className={styles.pip} style={{ background: PIP_COLOR[current.disc] }} />
            {DISC_LABEL[current.disc]} · {current.cat} · {current.year}
          </div>
          <h3 className={styles.title}>{current.title}</h3>
          <p className={styles.desc}>{current.desc.split('\n\n')[0]}</p>
        </div>

        <div className={styles.actions}>
          <TransitionLink
            href={`/works#${current.id}`}
            className={styles.primary}
            data-cursor="view"
            data-label="Open"
          >
            <span>Open project</span>
            <Arrow />
          </TransitionLink>
          <TransitionLink href="/works" className={styles.secondary}>
            All projects ({totalProjects})
          </TransitionLink>
        </div>
      </div>

      {!single && (
      <div className={styles.nav}>
        <div className={styles.counter}>
          {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </div>
        <div className={styles.arrows}>
          <button type="button" className={styles.prev} onClick={prev} aria-label="Previous project">
            <Arrow left />
          </button>
          <button type="button" className={styles.next} onClick={next} aria-label="Next project">
            <Arrow />
          </button>
        </div>
      </div>
      )}
    </div>
  );
}
