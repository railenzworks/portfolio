'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import type { Project, Discipline, Category } from '@/lib/projects';
import { DISC_LABEL } from '@/lib/projects';
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
    const ac = d === 'illustration' ? '#3f8d90' : d === 'graphic' ? '#3a67f0' : '#17150f';
    document.body.style.setProperty('--accent', ac);
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
          <div className={styles.empty}>Nothing here yet.</div>
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
              data-label="Open"
              onClick={(e) => { e.preventDefault(); handleOpen(p.id); }}
            >
              <div
                className={styles.cardMedia}
                style={{ aspectRatio: ASPECT_MAP[i % 3] }}
              >
                <span className={styles.cardIdx}>{pad(i + 1)}</span>
                <span className={`${styles.cardTag} ${p.disc === 'illustration' ? styles.tagIll : styles.tagGfx}`}>
                  {DISC_LABEL[p.disc]}
                </span>
                <Image
                  src={p.img}
                  alt={p.title}
                  fill
                  sizes="(max-width: 860px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className={styles.cardMeta}>
                <h3>{p.title}</h3>
                <span className={styles.yr}>{p.year}</span>
              </div>
              <div className={styles.cardCat}>{p.cat}</div>
            </a>
          );
        })}
      </main>

      <ProjectOverlay
        project={openProject}
        onClose={handleClose}
        onNext={handleNext}
        nextTitle={nextProject?.title ?? ''}
      />
    </>
  );
}
