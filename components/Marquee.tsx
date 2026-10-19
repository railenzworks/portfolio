import { getDict } from '@/lib/i18n-server';
import type { Dict } from '@/lib/i18n';
import { OvalMark, type OvalVariant } from './OvalMark';

interface MarqueeProps {
  style?: React.CSSProperties;
}

const ITEMS: { label: (t: Dict) => string; italic?: boolean; mark: OvalVariant }[] = [
  { label: (t) => t.disc.illustration, mark: 'design' },
  { label: (t) => t.disc.graphic, italic: true, mark: 'sketch' },
  { label: (t) => t.cat['Character Design'], mark: 'character' },
  { label: (t) => t.cat.Branding, italic: true, mark: 'ink' },
];

export async function Marquee({ style }: MarqueeProps) {
  const t = await getDict();
  // rendered twice so the -50% loop is seamless
  const row = [...ITEMS, ...ITEMS];

  return (
    <div className="marquee" aria-hidden="true" style={style}>
      <div className="marquee__inner">
        {row.map((item, i) => (
          <span key={i} className="marquee__item">
            <span className={item.italic ? 'serif-italic' : undefined}>{item.label(t)}</span>
            <OvalMark variant={item.mark} className="marquee__mark" />
          </span>
        ))}
      </div>
    </div>
  );
}
