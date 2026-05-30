'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import type { Project } from '@/lib/projects';
import { DISC_LABEL } from '@/lib/projects';
import styles from './ProjectOverlay.module.css';

interface ProjectOverlayProps {
  project: Project | null;
  onClose: () => void;
  onNext: () => void;
  nextTitle: string;
}

export function ProjectOverlay({ project, onClose, onNext, nextTitle }: ProjectOverlayProps) {
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
  const tagBg = isIll ? '#3f8d90' : '#3a67f0';

  return (
    <div className={`${styles.ov}${project ? ` ${styles.open}` : ''}`} id="ov">
      <div className={styles.scrim} onClick={onClose} />
      <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>
      <div className={styles.panel}>
        {project && (
          <>
            <div className={styles.media}>
              <Image
                src={project.img}
                alt={project.title}
                fill
                sizes="(max-width: 600px) 100vw, 680px"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className={styles.body}>
              <span className={styles.tag} style={{ background: tagBg }}>
                <span className={styles.tagPip} />
                <span>{DISC_LABEL[project.disc]}</span>
              </span>
              <h2>{project.title}</h2>
              <div className={styles.sub}>{project.cat} — {project.year}</div>
              <p className={styles.desc}>{project.desc}</p>
              <div className={styles.facts}>
                <div><div className={styles.k}>Year</div><div className={styles.v}>{project.year}</div></div>
                <div><div className={styles.k}>Category</div><div className={styles.v}>{project.cat}</div></div>
                <div><div className={styles.k}>Role</div><div className={styles.v}>{project.role}</div></div>
                <div><div className={styles.k}>Medium</div><div className={styles.v}>{project.med}</div></div>
              </div>
              <div
                className={styles.next}
                onClick={onNext}
                data-cursor="view"
                data-label="Next"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onNext()}
              >
                <span className={styles.nextK}>Next project →</span>
                <span className={styles.nextT}>{nextTitle}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
