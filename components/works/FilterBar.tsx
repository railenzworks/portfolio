'use client';

import type { Discipline, Category } from '@/lib/projects';
import { useLang } from '../LangProvider';
import styles from './FilterBar.module.css';

const DISC_FILTERS: { value: 'all' | Discipline; disc?: Discipline }[] = [
  { value: 'all' },
  { value: 'illustration', disc: 'illustration' },
  { value: 'graphic', disc: 'graphic' },
];

const CAT_FILTERS: Category[] = ['Editorial', 'Character Design', 'Branding', 'Posters', 'Events'];

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
  const { t } = useLang();
  return (
    <div className={styles.filters} id="filters">
      <span className={styles.lbl}>{t.works.craft}</span>
      <div className={styles.grp}>
        {DISC_FILTERS.map(({ value, disc }) => (
          <button
            key={value}
            className={`chip ${activeDisc === value ? 'on' : ''}`}
            {...(disc ? { 'data-disc': disc } : {})}
            onClick={() => onDiscChange(value)}
          >
            {disc && <span className="pip" />}
            {disc ? t.disc[disc] : t.works.all}
          </button>
        ))}
      </div>
      <span className={styles.lbl} style={{ marginLeft: '18px' }}>{t.works.category}</span>
      <div className={styles.grp}>
        {CAT_FILTERS.map((value) => (
          <button
            key={value}
            className={`chip ${activeCat === value ? 'on' : ''}`}
            onClick={() => onCatChange(activeCat === value ? null : value)}
          >
            {t.works.catShort[value] ?? t.cat[value]}
          </button>
        ))}
      </div>
      <span className={styles.count}>{shown} / {total}</span>
    </div>
  );
}
