'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { ProjectCover } from '../ProjectCover';
import type { Project, Discipline, Category } from '@/lib/projects';
import { loc } from '@/lib/i18n';
import { useLang } from '../LangProvider';
import { FilterBar } from './FilterBar';
import { ProjectOverlay } from './ProjectOverlay';
import styles from './WorksGrid.module.css';

const ASPECT_MAP = ['4/5', '1/1', '3/2'] as const;

function pad(n: number) {
  return String(n).padStart(2, '0');
}

interface WorksGridProps {
  projects: Project[];
}

export function WorksGrid({ projects }: WorksGridProps) {
  const { lang, t } = useLang();
  const [activeDisc, setActiveDisc] = useState<'all' | Discipline>('all');
  const [activeCat, setActiveCat] = useState<Category | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const gridRef = useRef<HTMLElement>(null);

  const visible = projects.filter((p) => {
    const okD = activeDisc === 'all' || p.disc === activeDisc;
    const okC = !activeCat || p.cat === activeCat;
    return okD && okC;
  });

  const openProject = projects.find((p) => p.id === openId) ?? null;
  const openIdx = openProject ? projects.findIndex((p) => p.id === openId) : -1;
  const nextProject = openIdx >= 0 ? projects[(openIdx + 1) % projects.length] : projects[0];

  const handleOpen = useCallback((id: string) => {
    setOpenId(id);
    history.replaceState(null, '', '#' + id);
  }, []);

  const handleClose = useCallback(() => {
    setOpenId(null);
    history.replaceState(null, '', '/works');
  }, []);

  const handleNext = useCallback(() => {
    if (!nextProject) return;
    handleOpen(nextProject.id);
  }, [nextProject, handleOpen]);

  const handleDiscChange = useCallback((d: 'all' | Discipline) => {
    setActiveDisc(d);
    setActiveCat(null);
    const ac = d === 'illustration' ? 'var(--teal-deep)' : d === 'graphic' ? 'var(--blue)' : null;
    // coloured accents carry white text; the default falls back to the theme's ink
    if (ac) {
      document.body.style.setProperty('--accent', ac);
      // the season's colours may be light, so each brings its own text colour
      document.body.style.setProperty('--on-accent', ac === 'var(--blue)' ? 'var(--on-blue)' : 'var(--on-teal)');
    } else {
      document.body.style.removeProperty('--accent');
      document.body.style.removeProperty('--on-accent');
    }
  }, []);

  const handleCatChange = useCallback((c: Category | null) => {
    setActiveCat(c);
  }, []);

  // Hash routing on mount
  useEffect(() => {
    const h = window.location.hash.replace('#', '');
    if (h === 'illustration') {
      handleDiscChange('illustration');
    } else if (h === 'graphic-design') {
      handleDiscChange('graphic');
    } else if (h && projects.some((p) => p.id === h)) {
      setTimeout(() => handleOpen(h), 650);
    }
  }, [projects, handleDiscChange, handleOpen]);

  // Re-observe scroll reveals after filter change
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    grid.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [visible.length]);

  return (
    <>
      <FilterBar
        activeDisc={activeDisc}
        activeCat={activeCat}
        shown={visible.length}
        total={projects.length}
        onDiscChange={handleDiscChange}
        onCatChange={handleCatChange}
      />

      <main className={styles.grid} ref={gridRef}>
        {visible.length === 0 && (
          <div className={styles.empty}>{t.works.empty}</div>
        )}
        {projects.map((p, i) => {
          const hidden = !visible.includes(p);
          return (
            <a
              key={p.id}
              className={`card reveal${hidden ? ' hide' : ''}`}
              href={'#' + p.id}
              data-id={p.id}
              data-disc={p.disc}
              data-cat={p.cat}
              data-cursor="view"
              data-label={t.featured.open}
              onClick={(e) => { e.preventDefault(); handleOpen(p.id); }}
            >
              <div
                className={styles.cardMedia}
                style={{ aspectRatio: ASPECT_MAP[i % 3] }}
              >
                <span className={styles.cardIdx}>{pad(i + 1)}</span>
                <span className={`${styles.cardTag} ${p.disc === 'illustration' ? styles.tagIll : styles.tagGfx}`}>
                  {t.disc[p.disc]}
                </span>
                <ProjectCover
                  project={p}
                  alt={loc(p.title, lang)}
                  sizes="(max-width: 860px) 100vw, 50vw"
                  quality={90}
                />
              </div>
              <div className={styles.cardMeta}>
                <h3>{loc(p.title, lang)}</h3>
                <span className={styles.yr}>{p.year}</span>
              </div>
              <div className={styles.cardCat}>{t.cat[p.cat]}</div>
            </a>
          );
        })}
      </main>

      <ProjectOverlay
        project={openProject}
        onClose={handleClose}
        onNext={handleNext}
        nextTitle={nextProject ? loc(nextProject.title, lang) : ''}
      />
    </>
  );
}
