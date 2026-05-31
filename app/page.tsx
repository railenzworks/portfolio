import type { Metadata } from 'next';
import Image from 'next/image';
import { getFeaturedProjects } from '@/lib/projects';
import { WorkCard } from '@/components/WorkCard';
import { Marquee } from '@/components/Marquee';
import { Footer } from '@/components/Footer';
import { TransitionLink } from '@/components/TransitionLink';
import { ScrollRevealWrapper } from '@/components/ScrollRevealWrapper';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'María Railenz — Illustration & Graphic Design',
  description: 'Illustration & Graphic Design. Two crafts, one hand. Madrid — Worldwide.',
};

export default function HomePage() {
  const featured = getFeaturedProjects();

  return (
    <ScrollRevealWrapper>
      {/* HERO */}
      <header className={styles.hero}>
        <div className="wrap">
          <div className={`${styles.heroEyebrow} reveal`}>
            <span>Illustrator &amp; Graphic Designer</span>
            <span>Madrid — Worldwide</span>
            <span>Portfolio © 2026</span>
          </div>

          <div className={styles.heroType}>
            <span className={`${styles.l1} line-mask`}><span>Selected pictures &amp; systems by</span></span>
            <span className={`${styles.name} line-mask`}><span>María</span></span>
            <span className={`${styles.name} line-mask`}><span><span className={styles.ill}>Railenz</span></span></span>
          </div>

          <div className={`${styles.heroImg} reveal reveal-d2`} data-cursor="view" data-label="Step in">
            <Image
              src="/images/hero.png"
              alt="Abstract composition"
              fill
              sizes="(max-width: 760px) 100vw, 440px"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>

          <p className={`${styles.heroStatement} reveal reveal-d2`}>
            I make pictures that talk — <b className={styles.teal}>illustration</b> — and the{' '}
            <b className={styles.blue}>graphic design</b> that holds them together. Two crafts, one hand.
          </p>
        </div>

        <div className={styles.scrollcue}>
          <span className={styles.ln} />
          Scroll to wander
        </div>
      </header>

      {/* INTRO STATEMENT */}
      <section className={styles.intro}>
        <div className={`wrap ${styles.introGrid}`}>
          <div className={`${styles.introLabel} reveal`}>(Statement)</div>
          <h2 className={`${styles.introBig} reveal reveal-d1`}>
            Between the <em className={styles.t}>drawn</em> and the <em className={styles.b}>designed</em>.
            I move from a single brushstroke to a full identity system without losing the
            handmade thread that runs through both.
          </h2>
        </div>
      </section>

      {/* FEATURED WORKS */}
      <section className={styles.featured}>
        <div className="wrap">
          <div className={`${styles.featuredHead} reveal`}>
            <h2>Selected Works</h2>
            <TransitionLink href="/works" className="mono" accent="#17150f">
              All projects ({12}) →
            </TransitionLink>
          </div>

          <div className={styles.works}>
            {featured.map((project, i) => {
              const slots = ['w-a', 'w-b', 'w-c', 'w-d'] as const;
              if (!slots[i]) return null;
              return <WorkCard key={project.id} project={project} slot={slots[i]} />;
            })}
          </div>
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
