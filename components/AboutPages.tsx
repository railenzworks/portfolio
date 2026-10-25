'use client';

import { useState } from 'react';
import { WIP_ABOUT_PAGES } from '@/lib/site';
import { useLang } from './LangProvider';
import { AboutBio } from './AboutBio';
import { AboutCarousel, type CarouselImage } from './AboutCarousel';
import { AboutGallery } from './AboutGallery';
import { AboutSection } from './AboutSection';
import { AboutSwitch } from './AboutSwitch';
import styles from './AboutPages.module.css';

type Page = 'about' | 'experience' | 'more';
const PAGES: Page[] = ['about', 'experience', 'more'];

// The About page is three inner pages (About, Experience, More), picked with a
// switch under the pictures. Each has its own deck and text; the deck is
// remounted on change so the new pictures pile up again.
export function AboutPages({ images, gallery }: { images: Record<Page, CarouselImage[]>; gallery: { src: string; position?: string }[] }) {
  const { t } = useLang();
  const a = t.about;
  const [page, setPage] = useState<Page>('about');

  return (
    <div className={styles.page}>
      {/* above the picture and the text, outside the keyed carousel so it stays
          put (and its pill slides) when the page changes */}
      <AboutSwitch
        className={styles.pages}
        label={a.sectionsLabel}
        value={page}
        onChange={setPage}
        options={PAGES.map((id) => ({ id, label: a.sections[id], wip: WIP_ABOUT_PAGES[id] }))}
      />
      <AboutCarousel
      key={page}
      wide={page === 'experience'}
      // Experience shows a bento gallery of captioned pictures instead of the deck
      gallery={
        page === 'experience' ? (
          <AboutGallery photos={gallery.map((g, i) => ({ ...g, caption: a.gallery[i] ?? '' }))} />
        ) : undefined
      }
      images={images[page]}
      nextLabel={a.nextImage}
    >
      {page === 'about' ? <AboutBio /> : <AboutSection page={page} />}
    </AboutCarousel>
    </div>
  );
}
