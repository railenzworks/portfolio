import type { Metadata } from 'next';
import { getDict } from '@/lib/i18n-server';
import HomePage from '../page';

// The link to share for the 2027 calendar pre-order: /calendario
// It shows the home page with the pre-order popup already open (CalendarPopup
// opens itself on this path) and gives the link its own preview — title, text
// and the calendar's poster — when pasted in WhatsApp, Instagram, etc.
//
// Set SITE_URL (e.g. https://mariarailenz.com) in the hosting's environment
// variables so the preview image gets an absolute address.
export async function generateMetadata(): Promise<Metadata> {
  const c = (await getDict()).calendar;
  return {
    metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
    title: { absolute: c.metaTitle },
    description: c.metaDesc,
    openGraph: {
      title: c.metaTitle,
      description: c.metaDesc,
      images: [{ url: '/images/calendario/calendario-2027.png', width: 1080, height: 1350, alt: c.imageAlt }],
    },
    twitter: { card: 'summary_large_image', title: c.metaTitle, description: c.metaDesc },
  };
}

export default HomePage;
