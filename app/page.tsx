import type { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'María Railenz — Coming Soon',
  description: 'Illustration & Graphic Design. Portfolio coming soon.',
};

export default function WIPPage() {
  return (
    <main className={styles.root}>
      <div className={styles.top}>
        <span className={styles.brand}>María <b>Railenz</b></span>
        <span className={styles.copy}>© 2026</span>
      </div>

      <div className={styles.center}>
        <p className={styles.label}>Illustration &amp; Graphic Design</p>
        <h1 className={styles.heading}>
          New portfolio<br />
          <em>in progress.</em>
        </h1>
        <p className={styles.sub}>
          Something worth looking at is on its way.<br />
          Check back soon.
        </p>
      </div>

      <div className={styles.bottom}>
        <span className={styles.location}>Madrid — Arenas de San Pedro</span>
        <a href="mailto:railenzworks@gmail.com" className={styles.email}>
          railenzworks@gmail.com
        </a>
      </div>
    </main>
  );
}
