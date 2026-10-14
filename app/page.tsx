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

      {/* DISCIPLINES SPLIT */}
      <section className={styles.split}>
        <TransitionLink
          href="/works#illustration"
          className={`${styles.disc} ${styles.discIll}`}
          accent="#8ad2d4"
          data-cursor="view"
          data-label="Enter teal"
        >
          <div className={`${styles.discNum} reveal`}>01 / Illustration</div>
          <div>
            <h3 className={`${styles.discTitle} reveal reveal-d1`}>Drawn<br /><em>worlds</em></h3>
            <div className={`${styles.discList} reveal reveal-d2`} data-stagger>
              <span>Editorial</span>
              <span>Character Design</span>
              <span>Illustration</span>
              <span>Posters</span>
            </div>
            <span className={styles.discGo}>Explore illustration <span className={styles.arr}>→</span></span>
          </div>
          <span className={styles.discBgnum}>01</span>
        </TransitionLink>

        <TransitionLink
          href="/works#graphic-design"
          className={`${styles.disc} ${styles.discGfx}`}
          accent="#3a67f0"
          data-cursor="view"
          data-label="Enter blue"
        >
          <div className={`${styles.discNum} reveal`}>02 / Graphic Design</div>
          <div>
            <h3 className={`${styles.discTitle} reveal reveal-d1`}>Designed<br /><em>systems</em></h3>
            <div className={`${styles.discList} reveal reveal-d2`} data-stagger>
              <span>Branding</span>
              <span>Posters</span>
              <span>Events</span>
              <span>Art Direction</span>
            </div>
            <span className={styles.discGo}>Explore design <span className={styles.arr}>→</span></span>
          </div>
          <span className={styles.discBgnum}>02</span>
        </TransitionLink>
      </section>

      {/* MARQUEE */}
      <Marquee style={{ borderBlock: '1px solid var(--line)', paddingBlock: '18px' }} />

      {/* CTA */}
      <section className={styles.cta}>
        <div className="wrap">
          <h2 className={`${styles.ctaBig} reveal`}>
            Let&apos;s make<br />something <em>worth</em> looking at.
          </h2>
          <p className="reveal reveal-d1">
            Open for commissions, collaborations and full identity projects from early 2026.
          </p>
          <TransitionLink href="/contact" className="btn reveal reveal-d2" accent="#3a67f0">
            <span>Start a project</span>
          </TransitionLink>
        </div>
      </section>

      <Footer
        preword="Say"
        headline="hello —"
        cta={{ label: 'railenzworks@gmail.com', href: 'mailto:railenzworks@gmail.com' }}
      />
    </ScrollRevealWrapper>
  );
}
