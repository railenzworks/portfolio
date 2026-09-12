import type { Metadata } from 'next';
import styles from './page.module.css';
import { FloatingCat } from '@/components/FloatingCat';

export const metadata: Metadata = {
  title: 'María Railenz — Coming Soon',
  description: 'Illustration & Graphic Design. Portfolio coming soon.',
};

export default function WIPPage() {
  return (
    <main className={styles.root}>
      <div className={styles.center}>
        <div className={styles.catWrap}>
          <FloatingCat />
        </div>
        <p className={styles.label}>Illustration &amp; Graphic Design</p>
        <h1 className={styles.heading}>
          New <span className={styles.accent}>portfolio</span> in <span className={styles.accent}>progress</span>.
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
