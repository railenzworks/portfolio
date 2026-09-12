import type { Metadata } from 'next';
import { Parkinsans } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { Nav } from '@/components/Nav';
import { CustomCursor } from '@/components/CustomCursor';
import { PageTransition } from '@/components/PageTransition';
import { FloatingCat } from '@/components/FloatingCat';

const valleySans = localFont({
  src: [
    { path: './fonts/ValleySans-Regular.ttf', weight: '400', style: 'normal' },
    { path: './fonts/ValleySans-Italic.ttf', weight: '400', style: 'italic' },
    { path: './fonts/ValleySans-Bold.ttf', weight: '700', style: 'normal' },
    { path: './fonts/ValleySans-BoldItalic.ttf', weight: '700', style: 'italic' },
    { path: './fonts/ValleySans-ExtraBold.ttf', weight: '800', style: 'normal' },
    { path: './fonts/ValleySans-ExtraBoldItalic.ttf', weight: '800', style: 'italic' },
  ],
  variable: '--font-serif',
  display: 'swap',
});

const parkinsansRead = Parkinsans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-read',
  display: 'swap',
});

const parkinsansMono = Parkinsans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'María Railenz — Illustration & Graphic Design',
    template: '%s — María Railenz',
  },
  description: 'Illustration & Graphic Design. From the mountains.',
  icons: { icon: '/favicon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${valleySans.variable} ${parkinsansRead.variable} ${parkinsansMono.variable}`}
    >
      <body>
        <CustomCursor />
        <PageTransition />
        <Nav />
        {children}
        <FloatingCat />
      </body>
    </html>
  );
}
