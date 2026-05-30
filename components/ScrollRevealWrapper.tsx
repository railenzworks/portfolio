'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { ReactNode } from 'react';

export function ScrollRevealWrapper({ children }: { children: ReactNode }) {
  const ref = useScrollReveal<HTMLDivElement>();
  return <div ref={ref}>{children}</div>;
}
