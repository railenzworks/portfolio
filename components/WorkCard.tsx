import Image from 'next/image';
import type { Project, Discipline } from '@/lib/projects';
import { TransitionLink } from './TransitionLink';
import styles from './WorkCard.module.css';

const SLOT_STYLES: Record<string, string> = {
  'w-a': styles.slotA,
  'w-b': styles.slotB,
  'w-c': styles.slotC,
  'w-d': styles.slotD,
};

const ASPECT: Record<string, string> = {
  'w-a': '4/5',
  'w-b': '4/5',
  'w-c': '1/1',
  'w-d': '3/2',
};

const PIP_COLOR: Record<Discipline, string> = {
  illustration: 'var(--teal)',
  graphic: 'var(--blue)',
};

const TAG_LABEL: Record<Discipline, string> = {
  illustration: 'Illustration',
  graphic: 'Graphic Design',
};

const SHORT_CAT: Record<string, string> = {
  Editorial: 'Editorial Illustration',
  'Character Design': 'Character Design',
  Branding: 'Branding · Identity',
  Posters: 'Posters',
  Events: 'Event Design · Posters',
};

interface WorkCardProps {
  project: Project;
  slot: 'w-a' | 'w-b' | 'w-c' | 'w-d';
}

export function WorkCard({ project, slot }: WorkCardProps) {
  return (
    <TransitionLink
      href={`/works#${project.id}`}
      className={`work ${slot} reveal ${SLOT_STYLES[slot] ?? ''}`}
      data-cursor="view"
      data-label="Open"
    >
      <div className={styles.media} style={{ aspectRatio: ASPECT[slot] }}>
        <span className={styles.tag}>
          <span className={styles.pip} style={{ background: PIP_COLOR[project.disc] }} />
          {TAG_LABEL[project.disc]}
        </span>
        <Image
          src={project.img}
          alt={project.title}
          fill
          sizes="(max-width: 860px) 100vw, 40vw"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className={styles.meta}>
        <h3>{project.title}</h3>
        <span className={styles.yr}>&apos;{project.year.slice(2)}</span>
      </div>
      <div className={styles.cat}>{SHORT_CAT[project.cat] ?? project.cat}</div>
    </TransitionLink>
  );
}
