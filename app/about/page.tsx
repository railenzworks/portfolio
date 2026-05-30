import type { Metadata } from 'next';
import Image from 'next/image';
import { Footer } from '@/components/Footer';
import { ScrollRevealWrapper } from '@/components/ScrollRevealWrapper';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About',
  description: 'An illustrator who designs, and a designer who draws.',
};

export default function AboutPage() {
  return (
    <ScrollRevealWrapper>
      <header className={`${styles.aHero} wrap`}>
        <div className={`${styles.top} reveal`}>
          <span>About</span>
          <span>María Railenz</span>
          <span>Madrid, ES — Est. 2018</span>
        </div>
        <h1 className="reveal reveal-d1">
          An illustrator who designs, and a designer who <em>draws.</em>
        </h1>
      </header>

      <section className={`wrap ${styles.aIntro}`}>
        <div className={`${styles.aPortrait} reveal`}>
          <div className={styles.frame}>
            <Image
              src="/images/maria-cut.png"
              alt="María Railenz — illustrated self-portrait"
              fill
              sizes="(max-width: 820px) 100vw, 40vw"
              style={{ objectFit: 'contain', objectPosition: 'center bottom', padding: '8% 6% 0' }}
            />
          </div>
          <div className={styles.cap}>
            <span>María Railenz</span>
            <span>Self-portrait</span>
          </div>
        </div>
        <div className={styles.aBio}>
          <p className={`${styles.lead} reveal reveal-d1`}>
            I&apos;m a Madrid-based illustrator and graphic designer working at the seam where pictures meet systems.
          </p>
          <p className="reveal reveal-d2">
            For nearly a decade I&apos;ve moved between two crafts that most people keep apart: the warm, hand-drawn world of <em>illustration</em> and the structured, grid-driven world of <em>graphic design</em>. I don&apos;t think they&apos;re opposites — a good identity needs a soul, and a good drawing needs a frame.
          </p>
          <p className="reveal reveal-d3">
            I work with publishers, studios, festivals and brands who want work that feels made by a person. Everything you see here is a placeholder, ready to be replaced with the real archive.
          </p>
        </div>
      </section>

      <section className={styles.approach}>
        <div className="wrap">
          <div className={`${styles.lbl} reveal`}>How I work</div>
          <h2 className="reveal reveal-d1">
            Three habits behind every <em>project</em>, drawn or designed.
          </h2>
          <div className={styles.steps} data-stagger>
            <div className={`${styles.step} reveal`}>
              <div className={styles.n}>01</div>
              <h3>Listen, then sketch</h3>
              <p>Every project starts on paper. I chase the idea by hand before a single pixel is placed, so the concept leads and the craft follows.</p>
            </div>
            <div className={`${styles.step} reveal`}>
              <div className={styles.n}>02</div>
              <h3>Build a system</h3>
              <p>Whether it&apos;s a character or a brand, I look for the underlying rules — a grid, a palette, a logic — so the work can grow without falling apart.</p>
            </div>
            <div className={`${styles.step} reveal`}>
              <div className={styles.n}>03</div>
              <h3>Keep the hand</h3>
              <p>I protect the small imperfections that make work feel human. Texture, weight and rhythm survive all the way to the final file.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={`wrap ${styles.practice}`}>
        <div className={`${styles.practiceRow} reveal`}>
          <div className={`${styles.col} ${styles.colT}`}>
            <div className={styles.colK}>Discipline 01</div>
            <h3>Illustration</h3>
            <ul>
              <li><span className={styles.num}>A.</span> Editorial &amp; cover illustration</li>
              <li><span className={styles.num}>B.</span> Character design</li>
              <li><span className={styles.num}>C.</span> Lettering &amp; type illustration</li>
              <li><span className={styles.num}>D.</span> Posters &amp; prints</li>
            </ul>
          </div>
          <div className={`${styles.col} ${styles.colB}`}>
            <div className={styles.colK}>Discipline 02</div>
            <h3>Graphic Design</h3>
            <ul>
              <li><span className={styles.num}>A.</span> Brand &amp; visual identity</li>
              <li><span className={styles.num}>B.</span> Art direction</li>
              <li><span className={styles.num}>C.</span> Event &amp; festival design</li>
              <li><span className={styles.num}>D.</span> Editorial &amp; print</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={`wrap ${styles.reco}`}>
        <div className={`${styles.recoHead} reveal`}>
          <h2>Selected clients</h2>
          <span className={styles.recoLbl}>A few good people</span>
        </div>
        <div className={`${styles.clients} reveal reveal-d1`}>
          <div>Atlas Press</div>
          <div>Norte Studio</div>
          <div>Echo Festival</div>
          <div>Carta &amp; Co.</div>
          <div>Wildflower</div>
          <div>Tempo Dance</div>
        </div>

        <div className={styles.awards}>
          <div className={`${styles.award} reveal`}>
            <span className={styles.yr}>2025</span>
            <span className={styles.awardTitle}>Editorial Illustration — Shortlist</span>
            <span className={styles.src}>Type &amp; Image Awards</span>
          </div>
          <div className={`${styles.award} reveal`}>
            <span className={styles.yr}>2024</span>
            <span className={styles.awardTitle}>Identity of the Year — Finalist</span>
            <span className={styles.src}>Brand New</span>
          </div>
          <div className={`${styles.award} reveal`}>
            <span className={styles.yr}>2023</span>
            <span className={styles.awardTitle}>Poster Series — Selected</span>
            <span className={styles.src}>Poster Biennale</span>
          </div>
          <div className={`${styles.award} ${styles.awardLast} reveal`}>
            <span className={styles.yr}>2022</span>
            <span className={styles.awardTitle}>New Talent — Feature</span>
            <span className={styles.src}>It&apos;s Nice That</span>
          </div>
        </div>
      </section>

      <Footer
        preword="Work"
        headline="together?"
        cta={{ label: 'Get in touch', href: '/contact', accent: '#3a67f0' }}
      />
    </ScrollRevealWrapper>
  );
}
