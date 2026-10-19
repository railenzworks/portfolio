import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Footer } from '@/components/Footer';
import { ScrollRevealWrapper } from '@/components/ScrollRevealWrapper';
import { getDict } from '@/lib/i18n-server';
import { WIP_PAGES } from '@/lib/site';
import styles from './page.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDict();
  return { title: t.about.label, description: t.about.metaDesc };
}

const LETTERS = ['A.', 'B.', 'C.', 'D.'];

const AWARDS = [
  { yr: '2025', src: 'Type & Image Awards' },
  { yr: '2024', src: 'Brand New' },
  { yr: '2023', src: 'Poster Biennale' },
  { yr: '2022', src: "It's Nice That" },
];

export default async function AboutPage() {
  // unfinished: see WIP_PAGES in lib/site.ts
  if (WIP_PAGES['/about']) redirect('/');
  const t = await getDict();
  const a = t.about;

  return (
    <ScrollRevealWrapper>
      <header className={`${styles.aHero} wrap`}>
        <div className={`${styles.top} reveal`}>
          <span>{a.label}</span>
          <span>María Railenz</span>
          <span>{a.since}</span>
        </div>
        <h1 className="reveal reveal-d1">
          {a.titlePre}<em>{a.titleEm}</em>
        </h1>
      </header>

      <section className={`wrap ${styles.aIntro}`}>
        <div className={`${styles.aPortrait} reveal`}>
          <div className={styles.frame}>
            <Image
              src="/images/maria-cut.png"
              alt={a.portraitAlt}
              fill
              sizes="(max-width: 820px) 100vw, 40vw"
              style={{ objectFit: 'contain', objectPosition: 'center bottom', padding: '8% 6% 0' }}
            />
          </div>
          <div className={styles.cap}>
            <span>María Railenz</span>
            <span>{a.selfPortrait}</span>
          </div>
        </div>
        <div className={styles.aBio}>
          <p className={`${styles.lead} reveal reveal-d1`}>{a.lead}</p>
          <p className="reveal reveal-d2">
            {a.bio1Pre}<em>{a.bio1Ill}</em>{a.bio1Mid}<em>{a.bio1Gfx}</em>{a.bio1Post}
          </p>
          <p className="reveal reveal-d3">{a.bio2}</p>
        </div>
      </section>

      <section className={styles.approach}>
        <div className="wrap">
          <div className={`${styles.lbl} reveal`}>{a.howLabel}</div>
          <h2 className="reveal reveal-d1">
            {a.howPre}<em>{a.howEm}</em>{a.howPost}
          </h2>
          <div className={styles.steps} data-stagger>
            {a.steps.map((s, i) => (
              <div key={i} className={`${styles.step} reveal`}>
                <div className={styles.n}>{String(i + 1).padStart(2, '0')}</div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`wrap ${styles.practice}`}>
        <div className={`${styles.practiceRow} reveal`}>
          <div className={`${styles.col} ${styles.colT}`}>
            <div className={styles.colK}>{a.discipline} 01</div>
            <h3>{t.disc.illustration}</h3>
            <ul>
              {a.illList.map((item, i) => (
                <li key={i}><span className={styles.num}>{LETTERS[i]}</span> {item}</li>
              ))}
            </ul>
          </div>
          <div className={`${styles.col} ${styles.colB}`}>
            <div className={styles.colK}>{a.discipline} 02</div>
            <h3>{t.disc.graphic}</h3>
            <ul>
              {a.gfxList.map((item, i) => (
                <li key={i}><span className={styles.num}>{LETTERS[i]}</span> {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={`wrap ${styles.reco}`}>
        <div className={`${styles.recoHead} reveal`}>
          <h2>{a.clients}</h2>
          <span className={styles.recoLbl}>{a.clientsLabel}</span>
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
          {AWARDS.map((aw, i) => (
            <div
              key={aw.yr}
              className={`${styles.award} ${i === AWARDS.length - 1 ? styles.awardLast : ''} reveal`}
            >
              <span className={styles.yr}>{aw.yr}</span>
              <span className={styles.awardTitle}>{a.awards[i].t}</span>
              <span className={styles.src}>{aw.src}</span>
            </div>
          ))}
        </div>
      </section>

      <Footer
        preword={a.footPre}
        headline={a.footHead}
        cta={{ label: a.footCta, href: '/contact' }}
      />
    </ScrollRevealWrapper>
  );
}
