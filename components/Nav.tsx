'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { TransitionLink } from './TransitionLink';
import { useLang } from './LangProvider';
import styles from './Nav.module.css';

const LINKS = [
  { href: '/works', key: 'works' },
  { href: '/about', key: 'about' },
  { href: '/contact', key: 'contact' },
] as const;

export function Nav() {
  const pathname = usePathname();
  const { t } = useLang();
  const navRef = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const pillShown = useRef(false);

  // The pill jumps to the clicked link right away instead of waiting
  // for the route change, then follows the real pathname.
  const [clicked, setClicked] = useState<string | null>(null);
  useEffect(() => setClicked(null), [pathname]);
  const activeHref = clicked ?? LINKS.find((l) => pathname.startsWith(l.href))?.href ?? null;

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const sync = () => {
      document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(nav);
    return () => ro.disconnect();
  }, []);

  // Slide the single background pill under the active link.
  useLayoutEffect(() => {
    const links = linksRef.current;
    const pill = pillRef.current;
    if (!links || !pill) return;

    const place = () => {
      const target = activeHref
        ? links.querySelector<HTMLElement>(`a[href="${activeHref}"]`)
        : null;
      if (!target) {
        pill.style.opacity = '0';
        pillShown.current = false;
        return;
      }
      // Appearing from nothing (e.g. leaving the home page): snap into
      // place and fade in rather than sliding in from a stale spot.
      if (!pillShown.current) pill.style.transition = 'opacity 0.25s';
      pill.style.width = `${target.offsetWidth}px`;
      pill.style.transform = `translateX(${target.offsetLeft}px)`;
      pill.style.opacity = '1';
      if (!pillShown.current) {
        pill.getBoundingClientRect();
        pill.style.transition = '';
        pillShown.current = true;
      }
    };

    place();
    const ro = new ResizeObserver(place);
    Array.from(links.children).forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [activeHref]);

  return (
    <nav className="nav" ref={navRef}>
      <TransitionLink href="/" className={styles.brand}>
        MARÍA <span className={styles.accent}>RAILENZ</span>
      </TransitionLink>
      <div className="links" ref={linksRef}>
        <span className="nav-pill" ref={pillRef} aria-hidden="true" />
        {LINKS.map(({ href, key }) => (
          <TransitionLink
            key={href}
            href={href}
            aria-current={href === activeHref ? 'page' : undefined}
            onClick={() => setClicked(href)}
          >
            {t.nav[key]}
          </TransitionLink>
        ))}
      </div>
    </nav>
  );
}
