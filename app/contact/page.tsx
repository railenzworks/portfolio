import type { Metadata } from 'next';
import { getDict } from '@/lib/i18n-server';
import Image from 'next/image';
import { ContactForm } from '@/components/contact/ContactForm';
import { Footer } from '@/components/Footer';
import { ScrollRevealWrapper } from '@/components/ScrollRevealWrapper';
import styles from './page.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDict();
  return { title: t.contact.label, description: t.contact.metaDesc };
}

export default async function ContactPage() {
  const t = await getDict();
  return (
    <ScrollRevealWrapper>
      <header className={`${styles.cHero} wrap`}>
        <div className={`${styles.top} reveal`}>
          <span>{t.contact.label}</span>
          <span>{t.contact.reply}</span>
          <span>Madrid — CET</span>
        </div>
        <h1 className="reveal reveal-d1">{t.contact.titleA}<br /><em>{t.contact.titleB}</em></h1>
        <div className={`${styles.cAvail} reveal reveal-d2`}>
          <span className={styles.dot} />
          {t.contact.available}
        </div>
      </header>

      <section className={`wrap ${styles.cGrid}`}>
        <ContactForm />

        <aside className={`${styles.aside} reveal reveal-d2`}>
          <div className={styles.cAvatar}>
            <Image
              src="/images/maria-cut.png"
              alt="María Railenz"
              fill
              sizes="96px"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className={styles.blk} style={{ borderTop: 0, paddingTop: 0 }}>
            <div className={styles.k}>{t.contact.email}</div>
            <a href="mailto:railenzworks@gmail.com">railenzworks@gmail.com</a>
          </div>
          <div className={styles.blk}>
            <div className={styles.k}>{t.contact.studio}</div>
            <span className={styles.v}>{t.contact.studioV}</span>
          </div>
          <div className={styles.blk}>
            <div className={styles.k}>{t.contact.elsewhere}</div>
            <div className={styles.socs}>
              <a href="https://instagram.com/railenz" target="_blank" rel="noreferrer">Instagram ↗</a>
              <a href="https://behance.net/mariarailenz" target="_blank" rel="noreferrer">Behance ↗</a>
            </div>
          </div>
          <div className={styles.blk} style={{ borderBottom: '1px solid var(--line)' }}>
            <div className={styles.k}>{t.contact.for}</div>
            <span className={styles.v}>{t.contact.forV}</span>
          </div>
        </aside>
      </section>

      <Footer
        preword={t.contact.footPre}
        headline={t.contact.footHead}
        cta={{ label: t.contact.footCta, href: '/works' }}
      />
    </ScrollRevealWrapper>
  );
}
