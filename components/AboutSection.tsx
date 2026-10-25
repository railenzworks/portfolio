'use client';

import { useLang } from './LangProvider';
import { highlight } from './AboutBio';
import styles from './AboutBio.module.css';

// The text of the Experience and More pages, beside the deck. The About page
// has its own, with the WHO / WHY switch (AboutBio).
export function AboutSection({ page }: { page: 'experience' | 'more' }) {
  const { t } = useLang();

  if (page === 'experience') {
    return (
      <div className={styles.bio}>
        <div className={styles.text}>
          {[t.about.experience, t.about.education].map((block, n) => (
            <section key={n} className={styles.block}>
              <h1 className={styles.lead}>{highlight(block.title)}</h1>
              <ul className={styles.timeline}>
                {block.items.map((it) => (
                  <li key={it.years + it.place + it.role}>
                    <span className={styles.heading}>
                      <strong>{it.role ?? it.place}</strong>
                      {it.role && <span className={styles.place}> | {it.place}</span>}
                    </span>
                    <span className={styles.years}>{it.years}</span>
                    {it.details?.map((d, i) => (
                      <span key={i} className={styles.detail}>{highlight(d)}</span>
                    ))}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    );
  }

  const m = t.about.more;
  return (
    <div className={styles.bio}>
      <div className={styles.text}>
        <h1 className={styles.lead}>{highlight(m.title)}</h1>
        {m.paras.map((p, i) => (
          <p key={i}>{highlight(p)}</p>
        ))}
      </div>
    </div>
  );
}
