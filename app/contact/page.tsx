import type { Metadata } from 'next';
import Image from 'next/image';
import { ContactForm } from '@/components/contact/ContactForm';
import { Footer } from '@/components/Footer';
import { ScrollRevealWrapper } from '@/components/ScrollRevealWrapper';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Start a project — reply within 48 hours.',
};

export default function ContactPage() {
  return (
    <ScrollRevealWrapper>
      <header className={`${styles.cHero} wrap`}>
        <div className={`${styles.top} reveal`}>
          <span>Contact</span>
          <span>Reply within 48h</span>
          <span>Madrid — CET</span>
        </div>
        <h1 className="reveal reveal-d1">Let&apos;s<br /><em>talk.</em></h1>
        <div className={`${styles.cAvail} reveal reveal-d2`}>
          <span className={styles.dot} />
          Available for projects — early 2026
        </div>
      </header>

      <section className={`wrap ${styles.cGrid}`}>
        <ContactForm />

        <aside className={`${styles.aside} reveal reveal-d2`}>
          <div className={styles.cAvatar}>
            <Image
              src="/images/maria-cut.png"
              alt="María Railenz"
              width={185}
              height={140}
              style={{ position: 'absolute', left: '50%', top: '-30px', transform: 'translateX(-50%)' }}
            />
          </div>
          <div className={styles.blk} style={{ borderTop: 0, paddingTop: 0 }}>
            <div className={styles.k}>Email</div>
            <a href="mailto:railenzworks@gmail.com">railenzworks@gmail.com</a>
          </div>
          <div className={styles.blk}>
            <div className={styles.k}>Studio</div>
            <span className={styles.v}>Madrid, Spain</span>
          </div>
          <div className={styles.blk}>
            <div className={styles.k}>Elsewhere</div>
            <div className={styles.socs}>
              <a href="https://instagram.com/railenz" target="_blank" rel="noreferrer">Instagram ↗</a>
              <a href="https://behance.net/mariarailenz" target="_blank" rel="noreferrer">Behance ↗</a>
            </div>
          </div>
          <div className={styles.blk} style={{ borderBottom: '1px solid var(--line)' }}>
            <div className={styles.k}>For</div>
            <span className={styles.v}>Commissions · Identity · Collaboration</span>
          </div>
        </aside>
      </section>

      <Footer
        preword="See"
        headline="the work —"
        cta={{ label: 'Browse projects', href: '/works', accent: '#17150f' }}
      />
    </ScrollRevealWrapper>
  );
}
