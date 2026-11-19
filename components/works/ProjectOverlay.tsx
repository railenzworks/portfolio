'use client';

import { useEffect, useRef } from 'react';
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

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ProjectOverlay({ project, onClose, onNext, nextTitle }: ProjectOverlayProps) {
  const { lang, t } = useLang();
  const ovRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const projectId = project?.id ?? null;
  const isOpen = projectId !== null;

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Remember what opened the dialog and give focus back to it on close.
  useEffect(() => {
    if (!isOpen) return;
    opener.current = document.activeElement as HTMLElement | null;
    return () => {
      const el = opener.current;
      if (el && el.isConnected && el !== document.body) el.focus({ preventScroll: true });
      opener.current = null;
    };
  }, [isOpen]);

  // Each project (also the "next" one) starts at the top, with focus on its title.
  useEffect(() => {
    if (!projectId) return;
    panelRef.current?.scrollTo({ top: 0 });
    titleRef.current?.focus({ preventScroll: true });
  }, [projectId]);

  // Escape closes, Tab stays inside the dialog — only while it is open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = Array.from(ovRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      const outside = !ovRef.current?.contains(active);
      if (e.shiftKey && (active === first || active === titleRef.current || outside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || outside)) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const isIll = project?.disc === 'illustration';
  const tagBg = isIll ? 'var(--teal-deep)' : 'var(--blue)';
  const tagFg = isIll ? 'var(--on-teal)' : 'var(--on-blue)';

  return (
    <div
      ref={ovRef}
      className={`${styles.ov}${project ? ` ${styles.open}` : ''}`}
      id="ov"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ov-title"
    >
      <div className={styles.scrim} onClick={onClose} aria-hidden="true" />
      <button type="button" className={styles.close} onClick={onClose} aria-label={t.works.close}>
        <span aria-hidden="true">✕</span>
      </button>
      <div className={styles.panel} ref={panelRef}>
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
                <span className={styles.tagPip} aria-hidden="true" />
                <span>{t.disc[project.disc]}</span>
              </span>
              <h2 id="ov-title" ref={titleRef} tabIndex={-1}>{loc(project.title, lang)}</h2>
              <div className={styles.sub}>{t.cat[project.cat]} — {project.year}</div>
              <p className={styles.desc}>{loc(project.desc, lang)}</p>
              <dl className={styles.facts}>
                <div><dt className={styles.k}>{t.works.year}</dt><dd className={styles.v}>{project.year}</dd></div>
                <div><dt className={styles.k}>{t.works.category}</dt><dd className={styles.v}>{t.cat[project.cat]}</dd></div>
                <div><dt className={styles.k}>{t.works.role}</dt><dd className={styles.v}>{loc(project.role, lang)}</dd></div>
                <div><dt className={styles.k}>{project.medLabel ? loc(project.medLabel, lang) : t.works.medium}</dt><dd className={styles.v}>{loc(project.med, lang)}</dd></div>
              </dl>
              <button
                type="button"
                className={styles.next}
                onClick={onNext}
                data-cursor="view"
                data-label={t.works.nextLabel}
              >
                <span className={styles.nextK}>{t.works.nextProject}</span>
                <span className={styles.nextT}>{nextTitle}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
