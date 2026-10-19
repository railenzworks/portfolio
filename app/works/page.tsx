import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getDict } from '@/lib/i18n-server';
import { WORKS_WIP } from '@/lib/site';
import { PROJECTS } from '@/lib/projects';
import { WorksGrid } from '@/components/works/WorksGrid';
import { Footer } from '@/components/Footer';
import { ScrollRevealWrapper } from '@/components/ScrollRevealWrapper';
import styles from './page.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDict();
  return { title: t.works.title, description: t.works.metaDesc };
}

export default async function WorksPage() {
  // unfinished: see WORKS_WIP in lib/site.ts
  if (WORKS_WIP) redirect('/');
  const t = await getDict();
  return (
    <ScrollRevealWrapper>
      <header className={`${styles.wHero} wrap`}>
        <div className={`${styles.top} reveal`}>
          <span>{t.works.archive.replace('{n}', String(PROJECTS.length))}</span>
          <span>2022 — 2026</span>
          <span>{t.works.crafts}</span>
        </div>
        <h1 className="reveal reveal-d1">{t.works.title}<em>.</em></h1>
        <p className={`${styles.sub} reveal reveal-d2`}>
          {t.works.sub}
        </p>
      </header>

      <WorksGrid projects={PROJECTS} />

      <Footer
        preword={t.works.footPre}
        headline={t.works.footHead}
        cta={{ label: t.works.footCta, href: '/contact' }}
      />
    </ScrollRevealWrapper>
  );
}
