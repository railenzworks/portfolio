'use client';

import { useState } from 'react';
import { useLang } from './LangProvider';
import { AboutSwitch } from './AboutSwitch';
import styles from './AboutBio.module.css';

type Tab = 'who' | 'why';

// "plain **highlighted** plain": the starred words become <em> (bold, blue)
export const highlight = (s: string) =>
  s.split('**').map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part));

// The About page's first section: a WHO / WHY switch above the text ("who" is
// the bio, "why" what drives the work). The text fades in each time it changes.
export function AboutBio() {
  const { t } = useLang();
  const a = t.about;
  const [tab, setTab] = useState<Tab>('who');

  return (
    <div className={styles.bio}>
      <AboutSwitch
        className={styles.switchGap}
        label={a.switchLabel}
        value={tab}
        onChange={setTab}
        options={[
          { id: 'who', label: a.tabs.who },
          { id: 'why', label: a.tabs.why },
        ]}
      />


      {/* both panels share one grid cell, so the block is always as tall as the
          longer one and the switch above never moves; the other is just hidden */}
      <div className={styles.panels}>
        <div className={tab === 'who' ? styles.text : styles.ghost} aria-hidden={tab !== 'who'}>
          <h1 className={styles.lead}>
            {a.titlePre}<em>{a.titleEm}</em>
          </h1>
          <p>{highlight(a.lead)}</p>
          <p>{highlight(a.bio1)}</p>
          <p>{highlight(a.bio2)}</p>
        </div>
        <div className={tab === 'why' ? styles.text : styles.ghost} aria-hidden={tab !== 'why'}>
          <h2 className={styles.lead}>{a.whyTitle}</h2>
          {a.why.map((p, i) => (
            <p key={i}>{highlight(p)}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
