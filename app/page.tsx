import type { Metadata } from 'next';
import { getDict } from '@/lib/i18n-server';
import { getFeaturedProjects, PROJECTS } from '@/lib/projects';
import { FeaturedTabs } from '@/components/FeaturedTabs';
import { Marquee } from '@/components/Marquee';
import { Footer } from '@/components/Footer';
import { TransitionLink } from '@/components/TransitionLink';
import { ScrollRevealWrapper } from '@/components/ScrollRevealWrapper';
import { HeroLetters } from '@/components/HeroLetters';
import { OvalRing } from '@/components/OvalMark';
import styles from './page.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDict();
  return { title: { absolute: t.home.metaTitle }, description: t.home.metaDesc };
}

export default async function HomePage() {
  const featured = getFeaturedProjects();
  const t = await getDict();

  return (
    <ScrollRevealWrapper>
      {/* HERO */}
      <HeroLetters />

      {/* FEATURED WORKS */}
      <section className={styles.featured}>
        <div className="wrap">
          <div className={`${styles.featuredHead} reveal`}>
            <h2>{t.home.selected}</h2>
          </div>

          <FeaturedTabs projects={featured} totalProjects={PROJECTS.length} />
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className="wrap">
          <h2 className={`${styles.ctaBig} reveal`}>
            {t.home.ctaPre}
            <em className={styles.ctaWord}>
              {t.home.ctaWord}
              <OvalRing
                backClassName={`${styles.ctaRing} ${styles.ctaRingBack}`}
                frontClassName={`${styles.ctaRing} ${styles.ctaRingFront}`}
                flowClassName={styles.ctaRingFlow}
              />
            </em>
            {t.home.ctaPost}
          </h2>
          <p className="reveal reveal-d1">
            {t.home.ctaLead}
          </p>
          <div className="reveal reveal-d2">
            <TransitionLink href="/contact" className="btn btn--solid">
              <span>{t.home.ctaBtn}</span>
            </TransitionLink>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <Marquee style={{ borderBlock: '1px solid var(--line)', paddingBlock: '18px' }} />

      <Footer />
    </ScrollRevealWrapper>
  );
}
