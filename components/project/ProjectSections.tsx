import { loc, type Lang, type Localized } from '@/lib/i18n';
import type { Block, ImageSlot, Section } from '@/lib/project-pages';
import { Illustrations } from './Illustrations';
import { ProjectTabs } from './ProjectTabs';
import { Picture, type PictureProps } from './Picture';
import styles from './ProjectSections.module.css';

export interface ProjectLabels {
  indexAria: string;
  pending: string;
  fonts: string;
  colours: string;
  disorders: string;
  portrait: string;
  entity: string;
  prev: string;
  next: string;
  zoom: string;
  close: string;
}

// "plain **highlighted** plain": the starred words become <em> (bold)
const rich = (s: string) => s.split('**').map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part));

// "4 / 5" is taller than wide
function isPortrait(ratio: string) {
  const [w, h] = ratio.split('/').map((n) => parseFloat(n));
  return !!w && !!h && h > w;
}

// The sections under a project's cover: an index, then each section with its
// modules. The content comes from lib/project-pages.ts.
export function ProjectSections({ sections, lang, labels }: { sections: Section[]; lang: Lang; labels: ProjectLabels }) {
  const L = (v: Localized) => loc(v, lang);

  // what a Picture needs from a slot, without the caption and the placeholder label
  const base = (slot: ImageSlot): Omit<PictureProps, 'caption' | 'pending'> => ({
    src: slot.src,
    alt: L(slot.hint),
    file: slot.file,
    ratio: slot.ratio,
    position: slot.position,
    contain: slot.contain,
  });
  const picture = (slot: ImageSlot): Omit<PictureProps, 'caption'> & { caption?: string } => ({
    ...base(slot),
    caption: slot.caption ? L(slot.caption) : undefined,
    pending: labels.pending,
  });

  // the texts of the enlarged view. Only the photos and drawings use it: the sizes
  // diagram, the grid and the typefaces are not meant to be enlarged
  const zoom = { open: labels.zoom, close: labels.close };

  // the sub-heading of a part, for the sections that hold several
  const sub = (h?: Localized) => (h ? <h3 className={styles.sub}>{L(h)}</h3> : null);

  const renderBlock = (b: Block, i: number) => {
    switch (b.kind) {
      case 'split': {
        const single = b.images.length === 1;
        const portrait = single && isPortrait(b.images[0].ratio);
        // the parts of a section take turns: picture on the right, then on the left
        const flip = i % 2 === 1;
        return (
          <div key={i} className={`${styles.block} ${styles.split} ${portrait ? styles.portrait : ''} ${flip ? styles.flip : ''}`}>
            <div className={styles.text}>
              {sub(b.heading)}
              {b.text.map((p, k) => (
                <p key={k}>{rich(L(p))}</p>
              ))}
              {b.note && <p className={styles.note}>{rich(L(b.note))}</p>}
            </div>
            <div className={`${styles.media} ${single ? '' : styles.multi}`}>
              {b.images.map((img) => (
                <Picture key={img.file} {...picture(img)} fill zoom={zoom} sizes={single ? '(max-width: 760px) 100vw, 50vw' : '(max-width: 760px) 50vw, 30vw'} />
              ))}
            </div>
          </div>
        );
      }

      case 'sizes':
        return (
          // the text on its own at the left; the card of sizes sits right beside the picture
          <div key={i} className={`${styles.block} ${styles.split} ${styles.sizesLayout}`}>
            <div className={styles.text}>
              {sub(b.heading)}
              <p>{rich(L(b.intro))}</p>
              <ul className={styles.chips}>
                {b.chips.map((c, k) => (
                  <li key={k}>{L(c)}</li>
                ))}
              </ul>
            </div>
            <div className={styles.sizesGroup}>
              <dl className={styles.rows}>
                {b.items.map((it, k) => (
                  <div key={k}>
                    <dt>{L(it.label)}</dt>
                    <dd>{it.value}</dd>
                  </div>
                ))}
              </dl>
              <div className={styles.media}>
                <Picture {...picture(b.image)} fill still sizes="(max-width: 760px) 100vw, 260px" />
              </div>
            </div>
          </div>
        );

      case 'aesthetic':
        return (
          <div key={i} className={`${styles.block} ${styles.aesthetic}`}>
            {sub(b.heading)}
            <div>
              <h3 className={styles.kicker}>{labels.fonts}</h3>
              <div className={styles.fonts}>
                {b.fonts.map((f) => (
                  <Picture key={f.name} {...picture(f.image)} still sizes="(max-width: 760px) 100vw, 30vw" />
                ))}
              </div>
            </div>
            <div>
              <h3 className={styles.kicker}>{labels.colours}</h3>
              <div className={styles.swatches}>
                {b.colours.map((c) => (
                  <div
                    key={c.cmyk.join('-')}
                    className={`${styles.swatch} ${c.dark ? styles.swatchDark : ''}`}
                    style={{ background: c.swatch }}
                  >
                    <ul>
                      {(['C', 'M', 'Y', 'K'] as const).map((k, n) => (
                        <li key={k}>
                          {k} = {c.cmyk[n]}%
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'illustrations':
        return (
          <div key={i} className={`${styles.block}`}>
            <Illustrations
              labels={{
                disorders: labels.disorders,
                portrait: labels.portrait,
                entity: labels.entity,
                pending: labels.pending,
                prev: labels.prev,
                next: labels.next,
                zoom: labels.zoom,
                close: labels.close,
              }}
              items={b.items.map((it) => ({
                id: it.id,
                name: L(it.name),
                full: it.full ? L(it.full) : undefined,
                portrait: base(it.portrait),
                entity: base(it.entity),
              }))}
            />
          </div>
        );

      case 'specs':
        return (
          <div key={i} className={`${styles.block} ${styles.split}`}>
            <div className={styles.text}>
              {sub(b.heading)}
              <p>{rich(L(b.intro))}</p>
              <div className={styles.groups}>
                {b.groups.map((g, k) => (
                  <div key={k} className={styles.groupCard}>
                    <h3 className={styles.kicker}>{L(g.title)}</h3>
                    <dl className={styles.facts}>
                      {g.rows.map((r, n) => (
                        <div key={n}>
                          <dt>{L(r.label)}</dt>
                          <dd>{L(r.value)}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
              <p className={styles.note}>{rich(L(b.note))}</p>
            </div>
            <div className={styles.media}>
              <Picture {...picture(b.image)} fill still sizes="(max-width: 760px) 100vw, 55vw" />
            </div>
          </div>
        );
    }
  };

  // each section is drawn here, on the server; ProjectTabs shows one at a time
  return (
    <ProjectTabs
      label={labels.indexAria}
      items={sections.map((s) => ({
        id: s.id,
        label: L(s.title),
        content: (
          <section className={styles.section} aria-labelledby={`${s.id}-title`}>
            <header className={`${styles.head}`}>
              <h2 id={`${s.id}-title`}>{L(s.title)}</h2>
            </header>
            {s.blocks.map(renderBlock)}
          </section>
        ),
      }))}
    />
  );
}
