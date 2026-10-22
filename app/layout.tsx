import type { Metadata } from 'next';
import { Parkinsans } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { Nav } from '@/components/Nav';
import { CustomCursor } from '@/components/CustomCursor';
import { FloatingCat } from '@/components/FloatingCat';
import { BottomBlur } from '@/components/BottomBlur';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SeasonPicker } from '@/components/SeasonPicker';
import { LangProvider } from '@/components/LangProvider';
import { LangToggle } from '@/components/LangToggle';
import { WipToast } from '@/components/WipToast';
import { ContactFolder } from '@/components/ContactFolder';
import { getLang } from '@/lib/i18n-server';

// Runs before first paint so a visitor never sees a flash of the wrong colours:
// light/dark (saved choice, else the system preference) and the saved season.
const themeScript = `(function(){try{var d=document.documentElement,t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';d.dataset.theme=t;var s=localStorage.getItem('season');if(s==='summer'||s==='spring'||s==='autumn'||s==='winter')d.dataset.season=s}catch(e){}})()`;

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <html
      lang={lang}
      className={`${valleySans.variable} ${railenz.variable} ${parkinsansRead.variable} ${parkinsansMono.variable}`}
      // data-theme is set by themeScript before React hydrates
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <LangProvider initial={lang}>
          <CustomCursor />
          <Nav />
          <div className="site-controls">
            <LangToggle />
            <SeasonPicker />
            <ThemeToggle />
          </div>
          {children}
          <BottomBlur />
          <FloatingCat />
          <WipToast />
          <ContactFolder />
        </LangProvider>
      </body>
    </html>
  );
}
