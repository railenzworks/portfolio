'use client';

import type { Discipline, Category } from '@/lib/projects';
import styles from './FilterBar.module.css';

const DISC_FILTERS = [
  { value: 'all' as const, label: 'All' },
  { value: 'illustration' as const, label: 'Illustration', disc: 'illustration' as Discipline },
  { value: 'graphic' as const, label: 'Graphic Design', disc: 'graphic' as Discipline },
];

const CAT_FILTERS: { value: Category; label: string }[] = [
  { value: 'Editorial', label: 'Editorial' },
  { value: 'Character Design', label: 'Character' },
  { value: 'Branding', label: 'Branding' },
  { value: 'Posters', label: 'Posters' },
  { value: 'Events', label: 'Events' },
];

interface FilterBarProps {
  activeDisc: 'all' | Discipline;
  activeCat: Category | null;
  shown: number;
  total: number;
  onDiscChange: (d: 'all' | Discipline) => void;
  onCatChange: (c: Category | null) => void;
}

export function FilterBar({
  activeDisc,
  activeCat,
  shown,
  total,
  onDiscChange,
  onCatChange,
}: FilterBarProps) {
  return (
    <div className={styles.filters} id="filters">
      <span className={styles.lbl}>Craft</span>
      <div className={styles.grp}>
        {DISC_FILTERS.map(({ value, label, disc }) => (
          <button
            key={value}
            className={`chip ${activeDisc === value ? 'on' : ''}`}
            {...(disc ? { 'data-disc': disc } : {})}
            onClick={() => onDiscChange(value)}
          >
            {disc && <span className="pip" />}
            {label}
          </button>
        ))}
      </div>
      <span className={styles.lbl} style={{ marginLeft: '18px' }}>Category</span>
      <div className={styles.grp}>
        {CAT_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            className={`chip ${activeCat === value ? 'on' : ''}`}
            onClick={() => onCatChange(activeCat === value ? null : value)}
          >
            {label}
          </button>
        ))}
      </div>
      <span className={styles.count}>{shown} / {total}</span>
    </div>
  );
}
