'use client';

import type { Discipline, Category } from '@/lib/projects';
import { useLang } from '../LangProvider';
import styles from './FilterBar.module.css';

const DISC_FILTERS: { value: 'all' | Discipline; disc?: Discipline }[] = [
  { value: 'all' },
  { value: 'illustration', disc: 'illustration' },
  { value: 'graphic', disc: 'graphic' },
];

const CAT_FILTERS: Category[] = ['Editorial', 'Character Design', 'Branding', 'Posters', 'Events', 'Sketchbook', 'Merchandising'];

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
    <div className={styles.filters} id="filters" role="group" aria-label={t.works.filters}>
      <span className={styles.lbl} id="filter-craft">{t.works.craft}</span>
      <div className={styles.grp} role="group" aria-labelledby="filter-craft">
        {DISC_FILTERS.map(({ value, disc }) => (
          <button
            key={value}
            type="button"
            className={`chip ${activeDisc === value ? 'on' : ''}`}
            aria-pressed={activeDisc === value}
            {...(disc ? { 'data-disc': disc } : {})}
            onClick={() => onDiscChange(value)}
          >
            {disc && <span className="pip" aria-hidden="true" />}
            {disc ? t.disc[disc] : t.works.all}
          </button>
        ))}
      </div>
      <span className={styles.lbl} id="filter-category" style={{ marginLeft: '18px' }}>{t.works.category}</span>
      <div className={styles.grp} role="group" aria-labelledby="filter-category">
        {CAT_FILTERS.map((value) => (
          <button
            key={value}
            type="button"
            className={`chip ${activeCat === value ? 'on' : ''}`}
            aria-pressed={activeCat === value}
            onClick={() => onCatChange(activeCat === value ? null : value)}
          >
            {t.works.catShort[value] ?? t.cat[value]}
          </button>
        ))}
      </div>
      {/* "3 / 7" for the eye; the full sentence is announced when a filter changes the result */}
      <span className={styles.count} aria-hidden="true">{shown} / {total}</span>
      <span className="sr-only" role="status" aria-live="polite">
        {t.works.showing.replace('{shown}', String(shown)).replace('{total}', String(total))}
      </span>
    </div>
  );
}
