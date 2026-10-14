import type { Metadata } from 'next';
import { getFeaturedProjects, PROJECTS } from '@/lib/projects';
import { FeaturedTabs } from '@/components/FeaturedTabs';
import { Marquee } from '@/components/Marquee';
import { Footer } from '@/components/Footer';
import { TransitionLink } from '@/components/TransitionLink';
import { ScrollRevealWrapper } from '@/components/ScrollRevealWrapper';
import { HeroLetters } from '@/components/HeroLetters';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'María Railenz — Illustration & Graphic Design',
  description: 'Illustration & Graphic Design. Two crafts, one hand. From the mountains.',
};

export default function HomePage() {
  const featured = getFeaturedProjects();

  return (
    <ScrollRevealWrapper>
      {/* HERO */}
      <HeroLetters />

      {/* FEATURED WORKS */}
      <section className={styles.featured}>
        <div className="wrap">
          <div className={`${styles.featuredHead} reveal`}>
            <h2>Selected Works</h2>
          </div>

          <FeaturedTabs projects={featured} totalProjects={PROJECTS.length} />
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className="wrap">
          <h2 className={`${styles.ctaBig} reveal`}>
            Let&apos;s make<br />something <em>worth</em> looking at.
          </h2>
          <p className="reveal reveal-d1">
            Open for commissions, collaborations and full identity projects from early 2026.
          </p>
          <TransitionLink href="/contact" className="btn reveal reveal-d2">
            <span>Start a project</span>
          </TransitionLink>
        </div>
      </section>

      {/* MARQUEE */}
      <Marquee style={{ borderBlock: '1px solid var(--line)', paddingBlock: '18px' }} />

      <Footer
        preword="Say"
        headline="hello —"
        cta={{ label: 'railenzworks@gmail.com', href: 'mailto:railenzworks@gmail.com' }}
      />
    </ScrollRevealWrapper>
  );
}
