import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDict, getLang } from '@/lib/i18n-server';
import { loc } from '@/lib/i18n';
import { isWipProject } from '@/lib/site';
import { PROJECTS } from '@/lib/projects';
import { PROJECT_PAGES } from '@/lib/project-pages';
import { Footer } from '@/components/Footer';
import { ProjectCover } from '@/components/ProjectCover';
import { ProjectSections } from '@/components/project/ProjectSections';
import { ScrollRevealWrapper } from '@/components/ScrollRevealWrapper';
import { TransitionLink } from '@/components/TransitionLink';
import styles from './page.module.css';

type Params = Promise<{ id: string }>;

// a project page exists only for projects that are no longer WIP (see
// WIP_PROJECTS in lib/site.ts); anything else is a 404
function findProject(id: string) {
  return isWipProject(id) ? undefined : PROJECTS.find((p) => p.id === id);
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const project = findProject((await params).id);
  if (!project) return {};
  const lang = await getLang();
  return {
    title: loc(project.title, lang),
    description: loc(project.desc, lang).split('\n\n')[0],
  };
}

function Arrow({ left = false }: { left?: boolean }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={left ? { transform: 'rotate(180deg)' } : undefined}
    >
      <path d="M3 8H13" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      <path
        d="M9.25 4.25L13 8L9.25 11.75"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function ProjectPage({ params }: { params: Params }) {
  const project = findProject((await params).id);
  if (!project) notFound();

  const t = await getDict();
  const lang = await getLang();
  const title = loc(project.title, lang);
  // the first paragraph of the description ("... es un proyecto que surge al unir ...") is not
  // shown on this page (it is the text of the home and of the previews); the rest is
  const [, ...rest] = loc(project.desc, lang).split('\n\n');

  // the sections under the cover (lib/project-pages.ts), if the project has them
  const sections = PROJECT_PAGES[project.id]?.sections;

  // illustration is teal, graphic design blue (the season's colours)
  const tone = {
    '--tone': project.disc === 'illustration' ? 'var(--teal-deep)' : 'var(--blue)',
  } as CSSProperties;

  return (
    <ScrollRevealWrapper>
      <main id="main" style={tone}>
        <div className={`${styles.wrap} wrap`}>
          {/* the cover as the page header: a rounded card as wide as the text below,
              right under the menu; the frosted facts card sits in its bottom-right corner */}
          <div className={`${styles.hero} reveal`}>
            <div className={styles.media}>
              <ProjectCover
                project={project}
                alt={title}
                sizes="(max-width: 760px) 100vw, 90vw"
                quality={90}
                priority
              />
              <div className={styles.grain} />
            </div>

            <TransitionLink href="/works" className={styles.back}>
              <Arrow left />
              <span>{t.works.title}</span>
            </TransitionLink>

            <dl className={styles.card}>
              <div><dt>{t.works.year}</dt><dd>{project.year}</dd></div>
              <div><dt>{t.works.category}</dt><dd>{t.cat[project.cat]}</dd></div>
              <div><dt>{t.works.role}</dt><dd>{loc(project.role, lang)}</dd></div>
              <div><dt>{project.medLabel ? loc(project.medLabel, lang) : t.works.medium}</dt><dd>{loc(project.med, lang)}</dd></div>
            </dl>
          </div>

          <section className={`${styles.story} reveal`}>
            {/* the title in the project's colour */}
            <div className={styles.intro}>
              <h1 className={styles.title}>{title}</h1>
            </div>
            {rest.length > 0 && (
              <div className={styles.more}>
                {rest.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}
          </section>

          {sections && <ProjectSections sections={sections} lang={lang} labels={t.project} />}

          <div className={`${styles.actions} reveal`}>
            <TransitionLink href="/works" className="btn btn--solid">
              <Arrow left />
              <span>{t.featured.allProjects}</span>
            </TransitionLink>
            {sections && (
              <a href="#indice" className={styles.reread}>
                {t.project.reread}
              </a>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </ScrollRevealWrapper>
  );
}
