interface MarqueeProps {
  style?: React.CSSProperties;
}

export function Marquee({ style }: MarqueeProps) {
  return (
    <div className="marquee" aria-hidden="true" style={style}>
      <div className="marquee__inner">
        <span>Illustration</span>
        <span className="dot" style={{ color: 'var(--teal-deep)' }}>✺</span>
        <span className="serif-italic">Graphic Design</span>
        <span className="dot" style={{ color: 'var(--blue)' }}>✺</span>
        <span>Character Design</span>
        <span className="dot" style={{ color: 'var(--coral)' }}>✺</span>
        <span className="serif-italic">Branding</span>
        <span className="dot" style={{ color: 'var(--teal-deep)' }}>✺</span>
        <span>Illustration</span>
        <span className="dot" style={{ color: 'var(--teal-deep)' }}>✺</span>
        <span className="serif-italic">Graphic Design</span>
        <span className="dot" style={{ color: 'var(--blue)' }}>✺</span>
        <span>Character Design</span>
        <span className="dot" style={{ color: 'var(--coral)' }}>✺</span>
        <span className="serif-italic">Branding</span>
        <span className="dot" style={{ color: 'var(--teal-deep)' }}>✺</span>
      </div>
    </div>
  );
}
