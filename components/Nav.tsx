'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { TransitionLink } from './TransitionLink';
import styles from './Nav.module.css';

const LINKS = [
  { href: '/', label: 'Home', accent: '#17150f' },
  { href: '/works', label: 'Works', accent: '#17150f' },
  { href: '/about', label: 'About', accent: '#8ad2d4' },
  { href: '/contact', label: 'Contact', accent: '#3a67f0' },
];

export function Nav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

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

  return (
    <nav className="nav" ref={navRef}>
      <TransitionLink href="/" className={styles.brand} accent="#17150f">
        María <b>Railenz</b>
      </TransitionLink>
      <div className="links">
        {LINKS.map(({ href, label, accent }) => {
          const current =
            href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <TransitionLink
              key={href}
              href={href}
              accent={accent}
              aria-current={current ? 'page' : undefined}
            >
              {label}
            </TransitionLink>
          );
        })}
      </div>
    </nav>
  );
}
