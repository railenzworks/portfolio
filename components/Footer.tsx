import { getDict } from '@/lib/i18n-server';
import { FooterSeasonFx } from './FooterSeasonFx';
import { TransitionLink } from './TransitionLink';

interface FooterProps {
  preword?: string;
  headline?: string;
  cta?: { label: string; href: string };
}

export async function Footer({ preword, headline, cta }: FooterProps) {
  const t = await getDict();
  const isExternal = cta ? cta.href.startsWith('mailto:') || cta.href.startsWith('http') : false;
  return (
    <footer className={`foot${cta ? '' : ' foot--slim'}`}>
      <FooterSeasonFx />
      {cta && (
        <div className="big">
          <span className="serif-italic">{preword}</span>&nbsp;{headline}&nbsp;
          {isExternal ? (
            // an email may wrap on phones: offer a break right after the @
            <a href={cta.href}>
              {cta.label.split('@').map((part, i) => (
                <span key={i}>{i > 0 && <>@<wbr /></>}{part}</span>
              ))}
            </a>
          ) : (
            <TransitionLink href={cta.href}>
              {cta.label}
            </TransitionLink>
          )}
        </div>
      )}
      <div className="row">
        <span>{t.footer.tagline}</span>
        <div style={{ display: 'flex', gap: '22px' }}>
          <a href="https://instagram.com/railenz" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://behance.net/mariarailenz" target="_blank" rel="noreferrer">
            Behance
          </a>
        </div>
        <span>{t.footer.rights}</span>
      </div>
    </footer>
  );
}
