import { TransitionLink } from './TransitionLink';

interface FooterProps {
  preword: string;
  headline: string;
  cta: { label: string; href: string; accent?: string };
}

export function Footer({ preword, headline, cta }: FooterProps) {
  const isExternal = cta.href.startsWith('mailto:') || cta.href.startsWith('http');
  return (
    <footer className="foot">
      <div className="big">
        <span className="serif-italic">{preword}</span>&nbsp;{headline}&nbsp;
        {isExternal ? (
          <a href={cta.href}>{cta.label}</a>
        ) : (
          <TransitionLink href={cta.href} accent={cta.accent}>
            {cta.label}
          </TransitionLink>
        )}
      </div>
      <div className="row">
        <span>María Railenz — Illustration &amp; Graphic Design</span>
        <div style={{ display: 'flex', gap: '22px' }}>
          <a href="https://instagram.com/railenz" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://behance.net/mariarailenz" target="_blank" rel="noreferrer">
            Behance
          </a>
        </div>
        <span>© 2026 — Madrid</span>
      </div>
    </footer>
  );
}
