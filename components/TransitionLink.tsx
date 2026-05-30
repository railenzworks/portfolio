'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ComponentPropsWithoutRef } from 'react';

interface TransitionLinkProps extends ComponentPropsWithoutRef<typeof Link> {
  accent?: string;
}

export function TransitionLink({ href, accent, onClick, children, ...props }: TransitionLinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (e.defaultPrevented) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    e.preventDefault();
    window.dispatchEvent(
      new CustomEvent('page-transition-start', { detail: { accent } })
    );
    setTimeout(() => router.push(href as string), 560);
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
