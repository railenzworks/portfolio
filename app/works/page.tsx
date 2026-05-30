import type { Metadata } from 'next';
import { PROJECTS } from '@/lib/projects';
import { WorksGrid } from '@/components/works/WorksGrid';
import { Footer } from '@/components/Footer';
import { ScrollRevealWrapper } from '@/components/ScrollRevealWrapper';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Works',
  description: 'A growing archive of drawn worlds and designed systems.',
};

export default function WorksPage() {
  return (
    <ScrollRevealWrapper>
      <header className={`${styles.wHero} wrap`}>
        <div className={`${styles.top} reveal`}>
          <span>Archive — {PROJECTS.length} projects</span>
          <span>2022 — 2026</span>
          <span>Illustration · Graphic Design</span>
        </div>
        <h1 className="reveal reveal-d1">Works<em>.</em></h1>
        <p className={`${styles.sub} reveal reveal-d2`}>
          A growing archive of drawn worlds and designed systems. Filter by craft or by category — every piece is a placeholder ready to be swapped for the real thing.
        </p>
      </header>

      <WorksGrid projects={PROJECTS} />

      <Footer
        preword="Like"
        headline="what you see?"
        cta={{ label: 'Start a project', href: '/contact', accent: '#3a67f0' }}
      />
    </ScrollRevealWrapper>
  );
}
