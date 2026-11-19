import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getDict, getLang } from '@/lib/i18n-server';
import { loc } from '@/lib/i18n';
import { WIP_PAGES, isWipProject } from '@/lib/site';
import { getFeaturedProjects } from '@/lib/projects';
import { AboutGallery } from '@/components/AboutGallery';
import { Footer } from '@/components/Footer';
import { ScrollRevealWrapper } from '@/components/ScrollRevealWrapper';
import styles from './page.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDict();
  return { title: t.works.title, description: t.works.metaDesc };
}

// Two columns of two, staggered: the tall one is on top in the first column
// and at the bottom in the second.
const COLS = [[1.35, 1], [1, 1.35]];

export default async function WorksPage() {
  // unfinished: see WIP_PAGES in lib/site.ts
  if (WIP_PAGES['/works']) redirect('/');
  const t = await getDict();
  const lang = await getLang();

  // While the archive is being finished, the page shows the same four projects
  // as the home, in the Experience gallery format, behind frosted glass and
  // marked as work in progress. The full grid (components/works/WorksGrid)
  // is kept for when it's ready.
  const projects = getFeaturedProjects();

  return (
    <ScrollRevealWrapper>
      <main id="main">
        {/* no visible header: the gallery is the page */}
        <h1 className="sr-only">{t.works.title}</h1>

        <section className={`${styles.galleryWrap} wrap reveal`}>
          <AboutGallery
            className={styles.gallery}
            cols={COLS}
            photos={projects.map((p) => ({
              src: p.img,
              // projects with several cover images show them all, like the home
              more: p.imgs,
              // finished projects (see WIP_PROJECTS in lib/site.ts) open their own page
              href: isWipProject(p.id) ? undefined : `/works/${p.id}`,
              caption: loc(p.title, lang),
              card: {
                tag: t.disc[p.disc],
                title: loc(p.title, lang),
                // only the first paragraph, like on the home
                desc: loc(p.desc, lang).split('\n\n')[0],
                meta: p.year,
                // illustration fades into teal, graphic design into blue
                tint: p.disc === 'illustration' ? 'var(--teal-deep)' : 'var(--blue)',
                onTint: p.disc === 'illustration' ? 'var(--on-teal)' : 'var(--on-blue)',
              },
            }))}
            wip={{ cursor: t.wip, open: t.featured.open }}
            // gentle: the hovered card only grows a little
            growth={{ col: 1.25, tile: 1.3 }}
          />
        </section>
      </main>

      <Footer />
    </ScrollRevealWrapper>
  );
}
