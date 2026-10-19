'use client';

import { useEffect } from 'react';
import { ProjectCover } from '../ProjectCover';
import type { Project } from '@/lib/projects';
import { loc } from '@/lib/i18n';
import { useLang } from '../LangProvider';
import styles from './ProjectOverlay.module.css';

interface ProjectOverlayProps {
  project: Project | null;
  onClose: () => void;
  onNext: () => void;
  nextTitle: string;
}

export function ProjectOverlay({ project, onClose, onNext, nextTitle }: ProjectOverlayProps) {
  const { lang, t } = useLang();
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [project]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const isIll = project?.disc === 'illustration';
  const tagBg = isIll ? 'var(--teal-deep)' : 'var(--blue)';
  const tagFg = isIll ? '#ffffff' : 'var(--on-blue)';

  return (
    <div className={`${styles.ov}${project ? ` ${styles.open}` : ''}`} id="ov">
      <div className={styles.scrim} onClick={onClose} />
      <button className={styles.close} onClick={onClose} aria-label={t.works.close}>✕</button>
      <div className={styles.panel}>
        {project && (
          <>
            <div className={styles.media}>
              <ProjectCover
                project={project}
                alt={loc(project.title, lang)}
                sizes="(max-width: 600px) 100vw, 680px"
                quality={90}
              />
            </div>
            <div className={styles.body}>
              <span className={styles.tag} style={{ background: tagBg, color: tagFg }}>
                <span className={styles.tagPip} />
                <span>{t.disc[project.disc]}</span>
              </span>
              <h2>{loc(project.title, lang)}</h2>
              <div className={styles.sub}>{t.cat[project.cat]} — {project.year}</div>
              <p className={styles.desc}>{loc(project.desc, lang)}</p>
              <div className={styles.facts}>
                <div><div className={styles.k}>{t.works.year}</div><div className={styles.v}>{project.year}</div></div>
                <div><div className={styles.k}>{t.works.category}</div><div className={styles.v}>{t.cat[project.cat]}</div></div>
                <div><div className={styles.k}>{t.works.role}</div><div className={styles.v}>{loc(project.role, lang)}</div></div>
                <div><div className={styles.k}>{t.works.medium}</div><div className={styles.v}>{loc(project.med, lang)}</div></div>
              </div>
              <div
                className={styles.next}
                onClick={onNext}
                data-cursor="view"
                data-label={t.works.nextLabel}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onNext()}
              >
                <span className={styles.nextK}>{t.works.nextProject}</span>
                <span className={styles.nextT}>{nextTitle}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
