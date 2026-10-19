'use client';

import { useEffect, useRef, useState } from 'react';
import { useLang } from './LangProvider';
import styles from './WipToast.module.css';

export const WIP_EVENT = 'wip-toast';

// Touch screens have no cursor to show "WIP" on, so tapping a locked link
// (see TransitionLink / WIP_PAGES in lib/site.ts) fires WIP_EVENT and this pill shows briefly.
export function WipToast() {
  const { t } = useLang();
  const [shown, setShown] = useState(false);
  const timer = useRef<number>(undefined);

  useEffect(() => {
    const show = () => {
      setShown(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setShown(false), 1800);
    };
    window.addEventListener(WIP_EVENT, show);
    return () => {
      window.removeEventListener(WIP_EVENT, show);
      window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <div className={`${styles.toast} ${shown ? styles.on : ''}`} role="status" aria-live="polite">
      {shown ? t.wipToast : ''}
    </div>
  );
}
