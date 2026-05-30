import type { Metadata } from 'next';
import { Sora, Manrope, Space_Mono } from 'next/font/google';
import './globals.css';
import { Nav } from '@/components/Nav';
import { CustomCursor } from '@/components/CustomCursor';
import { PageTransition } from '@/components/PageTransition';

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-serif',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-read',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'María Railenz — Illustration & Graphic Design',
    template: '%s — María Railenz',
  },
  description: 'Illustration & Graphic Design. Madrid — Worldwide.',
  icons: { icon: '/favicon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${manrope.variable} ${spaceMono.variable}`}
    >
      <body>
        <CustomCursor />
        <PageTransition />
        <Nav />
        {children}
      </body>
    </html>
  );
}
