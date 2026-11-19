'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AboutSwitch } from '../AboutSwitch';
import styles from './ProjectTabs.module.css';

interface ProjectTabsProps {
  /** one per section of the page: `id` is also the #hash that opens it */
  items: { id: string; label: string; content: ReactNode }[];
  /** aria-label of the switch */
  label: string;
}

/** how long the section on screen takes to fade out before the next one fades in (ms); keep in step with .out in the CSS */
const FADE_OUT = 200;

// The sections of a project page behind a switch, in the same glass pill as the
// one on the About page: only the section picked is shown. The others stay in
// the page, hidden, so they are still part of the document.
//
// Changing section is a fade: the pill moves at once, the section on screen
// fades out, the next one takes its place and fades in.
export function ProjectTabs({ items, label }: ProjectTabsProps) {
  const firstId = items[0]?.id ?? '';
  // `target` is what the pill points at; `shown` is the section on screen. They
  // differ only during the fade-out.
  const [target, setTarget] = useState(firstId);
  const [shown, setShown] = useState(firstId);
  const [fading, setFading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  // a link to /works/<id>#libro opens that section
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id && id !== firstId && items.some((it) => it.id === id)) {
      setTarget(id);
      setShown(id);
      // on phones there is no switch: go to the section itself
      const phone = window.matchMedia('(max-width: 760px)').matches;
      document.getElementById(phone ? id : 'indice')?.scrollIntoView({ block: 'start' });
    }
    // only on arrival
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // on narrow screens the pill is wider than the window and scrolls sideways:
  // keep the active option in view
  useEffect(() => {
    const sc = scrollRef.current;
    const btn = sc?.querySelector<HTMLElement>(`[data-tab="${target}"]`);
    if (!sc || !btn || sc.scrollWidth <= sc.clientWidth) return;
    const left = btn.getBoundingClientRect().left - sc.getBoundingClientRect().left + sc.scrollLeft;
    sc.scrollTo({ left: left - (sc.clientWidth - btn.offsetWidth) / 2, behavior: 'smooth' });
  }, [target]);

  // the content of another section is shorter or longer than the one you were
  // reading: if you had scrolled down, start the new one right under the pinned
  // switch instead of wherever the page happens to land (it is invisible at this
  // point: the fade-in hasn't started)
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const sc = scrollRef.current;
    const pill = sc?.querySelector<HTMLElement>('[role="group"]');
    const panel = document.getElementById(shown);
    if (!sc || !pill || !panel) return;
    const wanted = pill.getBoundingClientRect().bottom + 20;
    const top = panel.getBoundingClientRect().top;
    if (top < wanted) window.scrollBy({ top: top - wanted, behavior: 'auto' });
  }, [shown]);

  const pick = (id: string) => {
    setTarget(id);
    // so the address can be shared (and the browser's back button isn't filled with tabs)
    history.replaceState(null, '', `#${id}`);

    window.clearTimeout(timer.current);
    // back to the one on screen before the swap happened: nothing to change
    if (id === shown) {
      setFading(false);
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(id);
      return;
    }
    setFading(true);
    timer.current = window.setTimeout(() => {
      setShown(id);
      setFading(false);
    }, FADE_OUT);
  };

  return (
    <>
      <div id="indice" className={`${styles.scroll} reveal`} ref={scrollRef}>
        <AboutSwitch
          className={styles.sw}
          label={label}
          value={target}
          onChange={pick}
          options={items.map(({ id, label: l }) => ({ id, label: l }))}
        />
      </div>

      <div className={`${styles.panels} ${fading ? styles.out : ''}`}>
        {items.map((it) => (
          <div key={it.id} id={it.id} hidden={it.id !== shown}>
            {it.content}
          </div>
        ))}
      </div>
    </>
  );
}
