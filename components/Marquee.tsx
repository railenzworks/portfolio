import { OvalMark, type OvalVariant } from './OvalMark';

interface MarqueeProps {
  style?: React.CSSProperties;
}

const ITEMS: { label: string; italic?: boolean; mark: OvalVariant }[] = [
  { label: 'Illustration', mark: 'design' },
  { label: 'Graphic Design', italic: true, mark: 'sketch' },
  { label: 'Character Design', mark: 'character' },
  { label: 'Branding', italic: true, mark: 'ink' },
];

export function Marquee({ style }: MarqueeProps) {
  // rendered twice so the -50% loop is seamless
  const row = [...ITEMS, ...ITEMS];

  return (
    <div className="marquee" aria-hidden="true" style={style}>
      <div className="marquee__inner">
        {row.map((item, i) => (
          <span key={i} className="marquee__item">
            <span className={item.italic ? 'serif-italic' : undefined}>{item.label}</span>
            <OvalMark variant={item.mark} className="marquee__mark" />
          </span>
        ))}
      </div>
    </div>
  );
}
