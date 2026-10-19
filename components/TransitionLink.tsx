'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentPropsWithoutRef } from 'react';
import { WORKS_WIP, isWorksHref } from '@/lib/site';
import { useLang } from './LangProvider';
import { WIP_EVENT } from './WipToast';

type TransitionLinkProps = ComponentPropsWithoutRef<typeof Link>;

// Plain Next link that scrolls back to the top instead of re-navigating
// when it points at the page you're already on.
export function TransitionLink({ href, onClick, children, ...props }: TransitionLinkProps) {
  const pathname = usePathname();
  const { t } = useLang();
  // links into the unfinished works page: "WIP" on the cursor, clicks do nothing
  const locked = WORKS_WIP && isWorksHref(href);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (locked) {
      e.preventDefault();
      // no cursor label on touch screens: show the toast instead
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        window.dispatchEvent(new Event(WIP_EVENT));
      }
      return;
    }
    if (onClick) onClick(e);
    if (e.defaultPrevented) return;

    if (href === pathname) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      {...props}
      {...(locked && {
        prefetch: false,
        'aria-disabled': true,
        'data-cursor': 'view',
        'data-label': t.wip,
        'data-wip': '',
      })}
    >
      {children}
    </Link>
  );
}
