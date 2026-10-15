import type { Metadata } from 'next';
import { Parkinsans } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { Nav } from '@/components/Nav';
import { CustomCursor } from '@/components/CustomCursor';
import { FloatingCat } from '@/components/FloatingCat';
import { BottomBlur } from '@/components/BottomBlur';

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

const railenz = localFont({
  src: './fonts/Railenz-Regular.ttf',
  weight: '400',
  style: 'normal',
  variable: '--font-railenz',
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
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png', sizes: '256x256' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${valleySans.variable} ${railenz.variable} ${parkinsansRead.variable} ${parkinsansMono.variable}`}
    >
      <body>
        <CustomCursor />
        <Nav />
        {children}
        <BottomBlur />
        <FloatingCat />
      </body>
    </html>
  );
}
