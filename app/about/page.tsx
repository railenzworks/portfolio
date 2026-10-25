import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AboutPages } from '@/components/AboutPages';
import { Footer } from '@/components/Footer';
import { ScrollRevealWrapper } from '@/components/ScrollRevealWrapper';
import { getDict } from '@/lib/i18n-server';
import { WIP_PAGES } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDict();
  return { title: t.about.label, description: t.about.metaDesc };
}

// photos in the carousel after the first one (the sunset by the sea)
const CAROUSEL_PHOTOS: { src: string; sizes?: string; frame?: string }[] = [
  { src: '/images/about/02-gato-ventana.jpg' },
  // mirror selfie: María and the cat are on the right, so zoom in and pull them to the middle
  { src: '/images/about/03-espejo.jpg', sizes: '450px', frame: 'scale(1.5) translate(-16%, -9%)' },
  { src: '/images/about/04-nieve.jpg' },
  { src: '/images/about/05-gato-montana.jpg' },
  { src: '/images/about/06-rio.jpg' },
  { src: '/images/about/07-mirador.jpg' },
  { src: '/images/about/08-chefchaouen.jpg' },
];

// the five pictures of the Experience gallery, in tile order (two in the
// first column, then three); captions are in lib/i18n.ts
const GALLERY = [
  { src: '/images/about/09-ikn-ai.png' },
  { src: '/images/about/10-big-ideas.png' },
  { src: '/images/about/11-dibujo.png' },
  { src: '/images/about/12-defensa.png' },
  // the flute player (María) is at the left of the photo
  { src: '/images/about/13-musica.png', position: '0% 50%' },
];

// More has no pictures of its own yet: for now it reuses the same photos in
// another order, until the real ones are added
const pick = (...i: number[]) => i.map((n) => CAROUSEL_PHOTOS[n]);

export default async function AboutPage() {
  // unfinished: see WIP_PAGES in lib/site.ts
  if (WIP_PAGES['/about']) redirect('/');
  const t = await getDict();
  const a = t.about;

  const withAlt = (photos: typeof CAROUSEL_PHOTOS) => photos.map((p) => ({ ...p, alt: '' }));

  return (
    <ScrollRevealWrapper>
      <AboutPages
        images={{
          about: [
            // landscape photo cropped into a portrait card: it's drawn about
            // twice as wide as the card, so it needs a bigger file to stay sharp
            { src: '/images/about/01-atardecer.jpg', alt: a.photoAlt, sizes: '700px' },
            ...withAlt(CAROUSEL_PHOTOS),
          ],
          experience: [],
          more: withAlt(pick(6, 4, 2, 1)),
        }}
        gallery={GALLERY}
      />

      <Footer />
    </ScrollRevealWrapper>
  );
}
